'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { AccountInfo } from '@azure/msal-browser'
import { getMsalInstance, ensureMsalInitialized, loginRequest, msalConfig } from '@/app/lib/auth/msalConfig'

interface MeData {
  me: unknown
  allProducts: unknown[]
  products: unknown[]
}

interface AuthContextValue {
  /** MSAL 是否初始化完成（未完成前不要触发登录） */
  initialized: boolean
  /** 当前登录的微软账户（仅浏览器 MSAL 登录时有值），未登录为 null */
  account: AccountInfo | null
  /** 当前可用的微软 access token（仅浏览器 MSAL 登录时有值），未登录为 null */
  accessToken: string | null
  /** 调用 /api/me 后拿到的后端用户态（含 me/allProducts/products），未登录为 null */
  me: MeData | null
  /** 正在拉取 /api/me */
  meLoading: boolean
  /** 是否由桌面端/命令行通过请求头注入完成认证（此时网站侧没有 MSAL token） */
  viaDesktop: boolean
  /** 跳转方式登录微软（整页跳转到微软授权页，回调地址需已在 Azure 注册） */
  login: () => Promise<void>
  /** 跳转方式登出 */
  logout: () => Promise<void>
  /** 静默获取/刷新 token，供调用 /api/me 等接口使用 */
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [me, setMe] = useState<MeData | null>(null)
  const [meLoading, setMeLoading] = useState(false)
  const [viaDesktop, setViaDesktop] = useState(false)

  // 统一探测：
  // - 浏览器环境能静默拿到 MSAL token 就带上 Authorization 头；
  // - 拿不到（桌面端 WebView2 / 命令行）就裸发，依赖网络层注入的 Authorization / machine-code 头。
  // 后端只认 "Bearer <有效的微软 token>"，两种来源对它而言等价。任一成功即视为已登录并设置 me。
  const probe = useCallback(async (knownToken: string | null) => {
    setMeLoading(true)
    let token: string | null = knownToken
    if (!token && typeof window !== 'undefined') {
      try {
        const msal = getMsalInstance()
        await msal.initialize()
        const acc = msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null
        if (acc) {
          try {
            token = (await msal.acquireTokenSilent({ ...loginRequest, account: acc })).accessToken
          } catch {
            try {
              // 首次静默续期失败：强制刷新令牌再试一次（刷新后常见）
              token = (
                await msal.acquireTokenSilent({ ...loginRequest, account: acc, forceRefresh: true })
              ).accessToken
            } catch {
              token = null
            }
          }
          if (token) setAccessToken(token)
        }
      } catch {
        token = null
      }
    }

    try {
      const res = await fetch(
        '/api/me',
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      )
      if (res.ok) {
        const json = (await res.json()) as { code: number; data: MeData }
        if (json.code === 0) {
          setMe(json.data)
          // 没带浏览器 token 却成功，说明是桌面端 / 命令行在网络层注入的令牌
          setViaDesktop(!token)
        } else {
          setMe(null)
        }
      } else {
        setMe(null)
      }
    } catch {
      // 浏览器环境无注入头 + 无 MSAL token，必然失败，忽略
      setMe(null)
    } finally {
      setMeLoading(false)
    }
  }, [])

  // 浏览器：MSAL 初始化 + 捕获跳转回调 + 设置账户/令牌 + 回跳导航
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const msal = getMsalInstance()
        await msal.initialize()
        // 环境自检：当前访问域名必须和 Azure 注册的 redirectUri 完全一致，否则微软回跳会跳错地方
        if (
          typeof window !== 'undefined' &&
          window.location.origin !== msalConfig.auth.redirectUri
        ) {
          console.warn(
            `[Auth] 当前访问域名 ${window.location.origin} 与配置的 redirectUri ${msalConfig.auth.redirectUri} 不一致，` +
              `微软回跳可能跳错地方。请让 NEXT_PUBLIC_REDIRECT_URI 与你在 Azure 注册的重定向 URI 完全一致。`,
          )
        }
        // 捕获从微软授权页跳转回来的结果（含授权码/令牌）
        const result = await msal.handleRedirectPromise()
        if (result && result.account) {
          msal.setActiveAccount(result.account)
          setAccount(result.account)
          setAccessToken(result.accessToken)
          // 回跳后显式导航回发起登录的页面（MSAL 自带导航已关闭，避免与 Next router 冲突）
          const target =
            typeof window !== 'undefined'
              ? window.sessionStorage.getItem('msal.postLoginRedirect')
              : null
          if (target) {
            window.sessionStorage.removeItem('msal.postLoginRedirect')
            const current = window.location.pathname + window.location.search
            if (target !== current) router.replace(target)
          }
        } else {
          // 非跳转回调（普通刷新）：尝试从本地缓存恢复已登录账户（纯浏览器场景）
          const accounts = msal.getAllAccounts()
          if (accounts.length > 0) {
            const cached = accounts[0]
            msal.setActiveAccount(cached)
            setAccount(cached)
          }
        }
      } catch (e) {
        console.error('MSAL 初始化失败:', e)
      } finally {
        if (active) setInitialized(true)
      }
    })()
    return () => {
      active = false
    }
  }, [router])

  // 初始化完成 + 每次令牌变化时，统一探测一次 /api/me（带 token 或靠注入头）
  useEffect(() => {
    if (!initialized) return
    probe(accessToken)
  }, [initialized, accessToken, probe])

  const login = useCallback(async () => {
    try {
      const msal = await ensureMsalInitialized()
      // 记下发起登录的页面，回跳后用 Next router 跳回（而不是停留在首页）
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          'msal.postLoginRedirect',
          window.location.pathname + window.location.search,
        )
      }
      // 整页跳转到微软授权页；授权完成后微软会重定向回本站的 redirectUri，
      // 再由上面的 handleRedirectPromise 捕获结果并跳回原页面。
      await msal.loginRedirect(loginRequest)
    } catch (e) {
      console.error('Microsoft 登录跳转失败:', e)
    }
  }, [router])

  const logout = useCallback(async () => {
    // 先清空本地态
    setAccount(null)
    setAccessToken(null)
    setMe(null)
    setViaDesktop(false)
    try {
      const msal = await ensureMsalInitialized()
      const acc = msal.getActiveAccount()
      // 浏览器环境走微软结束会话；桌面端无 MSAL 账户，仅清本地态即可（下次加载由注入头重新认证）
      if (acc) await msal.logoutRedirect({ account: acc })
    } catch (e) {
      console.error('Microsoft 登出跳转失败:', e)
    }
  }, [router])

  const getToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken
    try {
      const msal = getMsalInstance()
      const acc = msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null
      if (!acc) return null
      const token = await msal.acquireTokenSilent({
        ...loginRequest,
        account: acc,
      })
      setAccessToken(token.accessToken)
      return token.accessToken
    } catch {
      return null
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{ initialized, account, accessToken, me, meLoading, viaDesktop, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必须在 <AuthProvider> 内部使用')
  }
  return ctx
}

'use client'

import { PublicClientApplication, NavigationClient, type Configuration } from '@azure/msal-browser'

// 从环境变量读取 Azure 应用(客户端)ID。请在 .env 中配置 NEXT_PUBLIC_MICROSOFT_CLIENT_ID
const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID ?? ''

// 让 MSAL 不要自己导航：回跳结果由 AuthProvider 用 Next router 处理，避免 App Router 下双重/失败跳转。
class NoOpNavigationClient extends NavigationClient {
  async navigate(): Promise<boolean> {
    return true
  }
}

// authority 必须与桌面端 steamsda 一致：tenant=consumers，即仅个人微软账号(hotmail/outlook/live)。
// 这样浏览器登录拿到的令牌和桌面端同属一个 Azure 应用注册，/api/me 都能认。
const authority = 'https://login.microsoftonline.com/consumers'

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority,
    // 跳转(Redirect)登录需要一个已注册的回调地址；显式固定，避免 window.location.origin 歧义。
    // 该值必须逐字符一致地在 Azure 门户「单页应用程序(SPA)」的重定向 URI 中注册。
    // 本地开发为 http://localhost:3000（注意：无末尾斜杠），线上改为你的 https 域名。
    redirectUri:
      process.env.NEXT_PUBLIC_REDIRECT_URI ?? 'http://localhost:3000',
  },
  // 接管 MSAL 的页面导航：用 no-op 让它不要自己用 window.location 跳（App Router 下不稳定），
  // 改由 AuthProvider 在捕获到回跳结果后用 Next router 显式跳回原页面。
  system: {
    navigationClient: new NoOpNavigationClient(),
  },
  cache: {
    // 浏览器本地持久化，刷新页面后仍能保持登录态
    cacheLocation: 'localStorage',
  },
}

// 调用 Microsoft Graph /me 所需的最小作用域，与现有后端 /api/me 完全兼容
export const loginRequest = {
  scopes: ['User.Read'],
}

// 延迟实例化：PublicClientApplication 构造时会检测 window.crypto。
// 服务端(SSR)渲染该客户端组件时会执行本模块，此时没有 window/crypto 会抛 crypto_nonexistent，
// 因此只在浏览器环境、且首次用到时才创建实例。
let _msalInstance: PublicClientApplication | null = null
export function getMsalInstance(): PublicClientApplication {
  if (typeof window === 'undefined') {
    throw new Error('MSAL 仅能在浏览器环境中使用')
  }
  if (!_msalInstance) {
    _msalInstance = new PublicClientApplication(msalConfig)
  }
  return _msalInstance
}

// MSAL v5 要求先 initialize() 才能 loginRedirect / logoutRedirect。
// 幂等：重复调用安全（实例内部已初始化时直接 resolve）。在浏览器环境调用。
export async function ensureMsalInitialized(): Promise<PublicClientApplication> {
  const msal = getMsalInstance()
  await msal.initialize()
  return msal
}

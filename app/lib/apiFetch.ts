// 统一的数据请求封装：自动处理微软 accessToken。
//
// 设计目标：
// - 浏览器：自动从 MSAL 静默获取令牌并附加 `Authorization: Bearer <token>`。
// - 服务端（Server Component / Route Handler / Server Action）：无法自行获取「用户」令牌，
//   需要调用方把入站请求的令牌转发进来（见下方「服务端用法」）。
// - 桌面端 / 命令行：WebView2 或 HTTP 客户端已在网络层注入 `Authorization` 头，
//   本封装不传令牌时也不会覆盖注入头，因此天然兼容。
//
// 注意：本文件不是 'use client'，可在服务端和客户端共用。MSAL 相关逻辑均限定在浏览器环境内。

import { getMsalInstance, loginRequest } from '@/app/lib/auth/msalConfig'

const isBrowser = typeof window !== 'undefined'

export interface ApiFetchOptions extends RequestInit {
  /** 显式传入的访问令牌（服务端转发场景：从入站请求头取出后转交）。 */
  accessToken?: string
  /** 是否自动附加 Bearer 令牌，默认 true；设为 false 可发匿名请求。 */
  withAuth?: boolean
}

/**
 * 浏览器端静默获取微软访问令牌。
 * 无登录态 / 静默续期失败时返回 null（调用方应据此走未登录逻辑或触发登录）。
 */
export async function getAccessToken(): Promise<string | null> {
  if (!isBrowser) return null
  try {
    const msal = getMsalInstance()
    await msal.initialize()
    const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null
    if (!account) return null
    const res = await msal.acquireTokenSilent({ ...loginRequest, account })
    return res.accessToken
  } catch {
    // 无账户或续期失败（如令牌过期且需交互刷新），返回 null 由上层决定下一步
    return null
  }
}

/**
 * 自动携带 accessToken 的 fetch。
 * @param input  请求地址（同原生 fetch）
 * @param options 额外选项：accessToken（转发令牌）、withAuth（是否带鉴权）、以及原生 fetch 的 init
 */
export async function apiFetch(
  input: RequestInfo | URL,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { accessToken, withAuth = true, headers, ...rest } = options
  const finalHeaders = new Headers(headers)

  if (withAuth) {
    // 浏览器自动取；服务端靠调用方通过 accessToken 转发
    const token = accessToken ?? (isBrowser ? await getAccessToken() : null)
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  return fetch(input, { ...rest, headers: finalHeaders })
}

/**
 * 服务端用法示例（在 Server Component / Route Handler 中）：
 *
 *   import { headers } from 'next/headers'
 *   import { apiFetch } from '@/app/lib/apiFetch'
 *
 *   const hdrs = await headers()                       // Next 15 中 headers() 为 async
 *   const token = hdrs.get('authorization')?.replace(/^Bearer\s+/i, '') ?? undefined
 *   const res = await apiFetch('/api/me', { accessToken: token })   // 转发用户令牌
 *
 * 桌面 / 命令行（注入头）场景无需任何特殊处理，直接：
 *   const res = await apiFetch('/api/me')
 */

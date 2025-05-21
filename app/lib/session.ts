// import 'server-only'
// import { SignJWT, jwtVerify } from 'jose'
// import { cookies } from 'next/headers'
// import { getCloudflareContext } from '@opennextjs/cloudflare'

// export type Session = {
//     userId: string
//     expiresAt: Date
// }
// const cloudflareCtx = getCloudflareContext({ async: false });
// const secretKey = cloudflareCtx.env.RESEND_API_KEY
// const encodedKey = new TextEncoder().encode(secretKey)

// export async function encrypt(payload: Session) {
//     return new SignJWT(payload)
//         .setProtectedHeader({ alg: 'HS256' })
//         .setIssuedAt()
//         .setExpirationTime('7d')
//         .sign(encodedKey)
// }

// export async function decrypt(session?: string) {
//     if (!session) {
//         return null;
//     }
//     try {
//         const { payload } = await jwtVerify(session, encodedKey, {
//             algorithms: ['HS256'],
//         });
//         return payload;
//     } catch (error) {
//         console.error('验证会话失败', error);
//         throw error; // 重新抛出异常，让调用者处理
//     }
// }
// export async function createSession(userId: string) {
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//     const session = await encrypt({ userId, expiresAt })

//     const cookieStore = await cookies()
//     cookieStore.set('session', session, {
//         httpOnly: true,
//         secure: true,
//         expires: expiresAt,
//         sameSite: 'lax',
//         path: '/',
//     })
// }
// export async function updateSession() {
//     const session = (await cookies()).get('session')?.value
//     const payload = await decrypt(session)

//     if (!session || !payload) {
//         return null
//     }

//     const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

//     const cookieStore = await cookies()
//     cookieStore.set('session', session, {
//         httpOnly: true,
//         secure: true,
//         expires: expires,
//         sameSite: 'lax',
//         path: '/',
//     })
// }

// export async function deleteSession() {
//     const cookieStore = await cookies()
//     cookieStore.delete('session')
// }
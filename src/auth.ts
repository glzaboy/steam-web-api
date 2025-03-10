import NextAuth from "next-auth"
import { D1Adapter } from "@auth/d1-adapter"
import { getCloudflareContext } from "@opennextjs/cloudflare"
// 用函数延迟获取适配器
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
    adapter: D1Adapter(process.env.DB)
})
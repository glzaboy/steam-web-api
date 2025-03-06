import { getCloudflareContext } from "@opennextjs/cloudflare"
import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"

const cloudflareCtx = getCloudflareContext({ async: false });

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Resend],
    secret: cloudflareCtx.env.AUTH_SECRET,
})
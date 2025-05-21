/** @type {import('next').NextConfig} */
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
const nextConfig = {
    serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;

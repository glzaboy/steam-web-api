import { sha256 } from "@/app/lib/hash";
import { getGraphMeInfo, type Me } from "@/app/lib/graph-client";
import { readCache, writeCache } from "./cache";

export async function getUserKvKey(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // 或者抛出错误，根据你的应用逻辑决定 
    }
    return "ME: " + await sha256(authHeader);
}

export async function getUserKvKeyByAccessToken(accessToken: string) {
    return "ME: " + await sha256('Bearer ' + accessToken);
}

export async function getUserInfoByCache(kvKey: string): Promise<Me | null> {
    return readCache<Me>(kvKey);
}
export async function getUserInfoByAccessToken(accessToken: string): Promise<Me | null> {
    const kvKey = await getUserKvKeyByAccessToken(accessToken);
    const userInfo = await getUserInfoByCache(kvKey);
    if (userInfo) {
        return userInfo;
    }
    const me = await getGraphMeInfo(accessToken);
    if (me) {
        await writeCache(kvKey, me, { ttl: 3600 });
    }
    return me;
}
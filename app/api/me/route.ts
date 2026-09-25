import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserInfoByAccessToken } from "@/app/lib/user";
import type { Me } from "@/app/lib/graph-client";
import { getDb } from "@/app/lib/db";
import * as schema from "@/db/schema";
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { code: 401, message: 'Invalid authorization header' },
                { status: 401 }
            )
        }
        // 3. 提取纯净的 token
        const token = authHeader.split(' ')[1]
        if (!token) {
            return NextResponse.json(
                { code: 401, message: 'Token 无效或已过期' },
                { status: 401 }
            )
        }
        // 校验令牌：令牌无效/过期时 getUserInfoByAccessToken 会抛错或返回 null。
        // 这里统一按 401 返回（此前会冒泡成 500），让前端能明确区分“未登录/登录已过期”。
        let me: Me | null = null
        try {
            me = await getUserInfoByAccessToken(token)
        } catch {
            me = null
        }
        if (!me) {
            return NextResponse.json(
                { code: 401, message: 'Token 无效或已过期' },
                { status: 401 }
            )
        }
        const db = getDb();

        const userInfo = await db
            .select()
            .from(schema.user)
            .where(eq(schema.user.userId, me?.id ?? ""));

        if (userInfo.length > 0 && userInfo[0]) {
            // 计算7天前的秒级时间戳
            const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
            const updatedAtTimestamp = Math.floor(userInfo[0].updateAt.getTime() / 1000);



            // 检查更新时间是否在7天前或更早
            if (updatedAtTimestamp <= sevenDaysAgo) {
                // 执行更新操作
                // 例如: 
                // await updateUserInfo(me.id);
                await db.update(schema.user).set({
                    info: JSON.stringify(me),
                    updateAt: new Date(),
                }).where(eq(schema.user.userId, me?.id ?? ""));
            }
        } else {
            await db.insert(schema.user).values({
                userId: me?.id ?? "",
                info: JSON.stringify(me),
            });
        }
        // [临时关闭] 机器码绑定校验：线上 machineBinding 尚无可绑定记录，而已发货桌面端必然会注入
        // machine-code 请求头，导致每个请求都被拦成 401「此机器码没有绑定，请绑定」。
        // 待后续补齐绑定流程后再启用此处逻辑。
        // const machine = request.headers.get("machine") ?? request.headers.get("machine-code");
        // if (machine != null) {
        //     const machineBindings = await db.select().from(schema.machineBinding).where(and(eq(schema.machineBinding.userId, me?.id ?? ""), eq(schema.machineBinding.isActive, true), eq(schema.machineBinding.machineId, machine)));
        //     if (machineBindings.length <= 0) {
        //         return NextResponse.json(
        //             { code: 401, message: '此机器码没有绑定，请绑定' },
        //             { status: 401 }
        //         )
        //     }
        // }



        const allProducts = await db.select().from(schema.allProduct)
        const products = await db.select().from(schema.product).where(eq(schema.product.userId, me?.id ?? ""))

        return Response.json({ code: 0, data: { me, allProducts, products }, message: "success" });
    } catch (error) {
        console.error('Error in GET request:', error)
        return NextResponse.json(
            { code: 500, message: 'Internal Server Error' },
            { status: 500 }
        )
    }

}

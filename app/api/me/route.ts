import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserInfoByAccessToken } from "@/app/lib/user";
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
        const me = await getUserInfoByAccessToken(token);
        const db = getDb();

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


import { Button } from "@/components/ui/button";
import { getDbAsync } from "@/app/lib/db"
import { Metadata } from "next";
import Link from 'next/link';
import { Suspense } from "react";
import { Flame } from 'lucide-react';
import { Loading } from "@/components/game/Loading";
// 或者
export const revalidate = 0; // 禁用缓存



export const metadata: Metadata = {
    title: "平台",
    description: "发现并游玩数千款免费在线游戏",
    keywords: ['游戏', '在线游戏', '免费游戏', '网页游戏', '休闲游戏'],
    openGraph: {
        title: "Game - 在线FC游戏，复古游戏，超级玛丽",
        description: "游戏, 在线游戏, 免费游戏, 网页游戏, 休闲游戏",
    },
    twitter: {
        title: "Game - 在线FC游戏，复古游戏，超级玛丽",
        description: "游戏, 在线游戏, 免费游戏, 网页游戏, 休闲游戏",
    },
    authors: [
        { name: "glzaboy", url: "github.com/SteamSda" }
    ],
};
export default async function Categories() {
    return <>
        <main className="grow">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <section className="mb-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Flame className="h-6 w-6 text-red-500" />
                            <h2 className="text-2xl font-bold">平台</h2>
                        </div>
                    </section>
                    <>
                        <Suspense fallback={<Loading />} >
                            <Platforms></Platforms>
                        </Suspense>
                    </>
                </div>
            </div>
        </main>
    </>
}
async function Platforms() {
    const db = await getDbAsync();
    //await new Promise(resolve => setTimeout(resolve, 3000));
    const [platforms] = await Promise.all([
        db.query.platforms.findMany({
            orderBy: (platforms, { asc }) => [
                asc(platforms.sort),  // 先按 sort
                asc(platforms.id)     // 再按 id
            ]
        })
    ])
    console.log(platforms);
    return (<>
        {
            platforms.map((element) => {
                return <Link key={element.id} href={{
                    pathname: `/platforms/${element.slug}`
                }}><Button variant="link" >{element.name}</Button></Link>
            })
        }
    </>);
}

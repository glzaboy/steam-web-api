import { Button } from "@/components/ui/button";
import { getDbAsync } from "@/app/lib/db"
import { Metadata } from "next";
import Link from 'next/link';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { Flame, Play, Info, Gamepad2, Download } from 'lucide-react';
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GameMarkdown from "@/components/game/GameMarkdown.server";

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

export default async function Game({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params;
    return <>
        <main className="grow">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <GameView id={id}></GameView>
                </div>
            </div>
        </main>
    </>
}

async function GameView({ id, }: { id: number }) {

    const db = await getDbAsync();
    const [games] = await Promise.all([
        db.query.games.findMany({
            where: (games, { and, eq }) => and(eq(games.id, id)),
            with: {
                category: true,
                platform: true
            }
        })
    ])
    if (games.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-600">游戏未找到</h2>
                <p className="mt-2 text-gray-500">抱歉，找不到您要的游戏</p>
                <Link href="/" className="mt-4 inline-block">
                    <Button>返回首页</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {games.map((game) => (
                <div key={game.id}>
                    {/* 移动端标题 - 移动到最顶部 */}
                    <div className="lg:hidden p-4 pb-0 border-b">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold truncate flex-1 mr-2">{game.title}</h1>
                            {game.categoryId && (
                                <Badge variant="secondary">{game.category?.name}</Badge>
                            )}
                        </div>
                        {game.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                                {game.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* 左侧：自适应图片区域 */}
                        <div className="lg:w-2/5 p-4 lg:p-6">
                            <div className="relative rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                                <div className="relative aspect-4/3 sm:aspect-video lg:aspect-square">
                                    <Image
                                        src={game.coverImage ?? "/placeholder.png"}
                                        alt={game.title}
                                        fill
                                        className="object-contain p-2"
                                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 40vw, 35vw"
                                        priority
                                        unoptimized={true}
                                    />
                                </div>
                                {game.isHot && (
                                    <Badge className="absolute left-3 top-3 bg-red-500 hover:bg-red-600">
                                        <Flame className="h-3 w-3 mr-1" />
                                        热门
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* 右侧：游戏详细信息和操作 */}
                        <div className="lg:w-3/5 p-4 lg:p-6">
                            {/* 桌面端标题 - 保持原样 */}
                            <div className="hidden lg:block mb-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h1 className="text-2xl font-bold">{game.title}</h1>
                                    </div>
                                    {game.categoryId && (
                                        <Badge variant="secondary">{game.category?.name}</Badge>
                                    )}
                                </div>
                            </div>

                            {/* 游戏属性网格 */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                {game.platformId && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Gamepad2 className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm text-gray-500">{game.platform?.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 长描述区域 */}
                            {game.description && (
                                <>
                                    <Separator className="my-4" />
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            <h3 className="font-semibold">游戏介绍</h3>
                                        </div>
                                        <GameMarkdown markdownContent={game.description}></GameMarkdown>
                                    </div>
                                </>
                            )}

                            {/* 操作按钮 */}
                            <div className="mt-6 pt-4 border-t">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="flex-1 text-lg bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                                    >
                                        <Link
                                            href={`https://gamepad.steamsda.com/EmulatorJS-4.2.3/index.html?rom=${game.romUrl}&coreType=${game.coreCype}`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Play className="h-6 w-6 sm:h-6 sm:w-6" />
                                            立即开始游戏
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="flex-1 text-lg"
                                            >
                                                <Download className="h-6 w-6 sm:h-6 sm:w-6 mr-2" />
                                                收藏游戏
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>收藏失败?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    暂时不支持收藏.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction>确定</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>

                                {/* 额外信息 */}
                                <div className="mt-4 text-xs text-gray-500">
                                    <p>• 点击<span className="text-red-500">立即开始</span>游戏将在新标签页中打开游戏</p>
                                    <p>• 游戏加载可能需要几秒钟，请耐心等待</p>
                                    <p>• 建议使用Chrome浏览器获得最佳游戏体验</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    )
}

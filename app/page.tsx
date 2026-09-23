import type { Metadata } from "next";

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

import {
  Users, Gamepad2, Flame
} from 'lucide-react';
import { ProductList } from '@/app/components/Product';
import Link from "next/link";

import { getDbAsync } from "@/app/lib/db";
import GameList from "@/components/game/GameList";
import { games } from "@/db/schema";
import { count } from "drizzle-orm";
import ServerPagination from "@/components/game/ServerPagination";



export const metadata: Metadata = {
  title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
  description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  keywords: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  openGraph: {
    title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
    description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  },
  twitter: {
    title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
    description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  },
  authors: [
    { name: "glzaboy", url: "github.com/SteamSda" }
  ]
};
export const revalidate = 3600; // 游戏列表缓存1小时

const ITEMS_PER_PAGE = 12;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>
}) {
  const q = await searchParams;
  const page = q.page ?? 1;

  const db = await getDbAsync();
  const [hotGames, allGames, totalGamesResult] = await Promise.all([
    db.query.games.findMany({
      where: (games, { eq }) => eq(games.isHot, true),
      limit: 8,
      with: { category: true },
      orderBy: (games, { desc }) => [desc(games.sort)],
    }),
    db.query.games.findMany({
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      with: { category: true },
      orderBy: (games, { desc }) => [desc(games.sort)],
    }),
    db.select({ count: count() }).from(games),
  ]);
  const totalGamesCount = totalGamesResult[0]?.count || 0;
  const totalPages = Math.ceil(totalGamesCount / ITEMS_PER_PAGE);

  const stats = [
    { name: '总用户数', value: '12,345', change: '+12%' },
    { name: '订单量', value: '2,567', change: '+18%' },
    { name: '转化率', value: '4.8%', change: '+2.1%' },
    { name: '平均响应', value: '24分钟', change: '-5%' },
  ];
  return <>
    {/* 主体内容 */}
    <main className="grow">
      {/* 游戏列表区块 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">热门游戏</h2>
        </div>
        <GameList games={hotGames} />

        <div className="flex items-center gap-2 mb-6 mt-12">
          <Gamepad2 className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">所有游戏</h2>
        </div>
        <GameList games={allGames} />
        {allGames.length > 0 ? (
          <div className="mt-12">
            <ServerPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/"
              pageParam="page"
              showInfo={true}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无游戏</h3>
          </div>
        )}
      </section>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className={`p-6`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className={`text-2xl font-bold`}>
                  便捷购买饰品，快乐生活
                </h1>
                <p className={`mt-2`}>
                  部分功能免费中，请期待
                </p>
                <p><Link href="https://game.steamsda.com" target="_blank">来个小游戏轻松一下</Link></p>
              </div>
              <div className="mt-4 md:mt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="link">详情</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>免费进行中</AlertDialogTitle>
                      <AlertDialogDescription>
                        回馈广大用户，即将上线免费试用。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>确定</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* 统计数据卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className={``}>
                  <CardHeader>
                    <CardTitle className={`text-sm font-medium`}>
                      {stat.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end">
                      <div className={`text-2xl font-bold`}>
                        {stat.value}
                      </div>
                      <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className={``}>
                  <CardHeader>
                    <CardTitle className={``}>
                      最新活动
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductList></ProductList>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="flex items-start">
                          <div className={`shrink-0 h-10 w-10 flex items-center justify-center`}>
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h4 className={`text-sm font-medium`}>
                              新用户注册
                            </h4>
                            <p className={`text-sm`}>
                              今天有 24 位新用户注册了我们的平台
                            </p>
                            <div className="mt-1 text-xs text-gray-400">
                              2小时前
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className={``}>
                  <CardHeader>
                    <CardTitle className={``}>
                      订阅更新
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-4`}>
                      订阅我们的新闻通讯，获取最新更新和优惠
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className={``}>
                          电子邮件
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="terms" />
                        <Label htmlFor="terms" className={``}>
                          我同意接收营销邮件
                        </Label>
                      </div>
                      <Button className="w-full">
                        订阅
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`mt-6 `}>
                  <CardHeader>
                    <CardTitle className={``}>
                      目标进度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium`}>
                            月度销售目标
                          </span>
                          <span className={`text-sm font-medium`}>
                            75%
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium`}>
                            用户增长
                          </span>
                          <span className={`text-sm font-medium`}>
                            45%
                          </span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium`}>
                            功能完成度
                          </span>
                          <span className={`text-sm font-medium`}>
                            90%
                          </span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
}

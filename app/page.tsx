
"use client";
import { useState } from 'react';
//import type { Metadata } from "next";

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


import {
  Users
} from 'lucide-react';



/*
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
};*/
export default function Home() {
  const stats = [
    { name: '总用户数', value: '12,345', change: '+12%' },
    { name: '订单量', value: '2,567', change: '+18%' },
    { name: '转化率', value: '4.8%', change: '+2.1%' },
    { name: '平均响应', value: '24分钟', change: '-5%' },
  ];
  const [darkMode] = useState(false);//@eslint-disable-line
  return <>
    {/* 主体内容 */}
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  欢迎来到我们的平台
                </h1>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  发现我们最新的产品和功能，帮助您提升业务效率
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="mr-2">
                  了解更多
                </Button>
                <Button>
                  开始使用
                </Button>
              </div>
            </div>

            {/* 统计数据卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className={darkMode ? 'bg-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {stat.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end">
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                <Card className={darkMode ? 'bg-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={darkMode ? 'text-white' : ''}>
                      最新活动
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-start">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              新用户注册
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
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
                <Card className={darkMode ? 'bg-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={darkMode ? 'text-white' : ''}>
                      订阅更新
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      订阅我们的新闻通讯，获取最新更新和优惠
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className={darkMode ? 'text-white' : ''}>
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
                        <Label htmlFor="terms" className={darkMode ? 'text-gray-300' : ''}>
                          我同意接收营销邮件
                        </Label>
                      </div>
                      <Button className="w-full">
                        订阅
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`mt-6 ${darkMode ? 'bg-gray-700' : ''}`}>
                  <CardHeader>
                    <CardTitle className={darkMode ? 'text-white' : ''}>
                      目标进度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            月度销售目标
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            75%
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            用户增长
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            45%
                          </span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            功能完成度
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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

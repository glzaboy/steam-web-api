"use client";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Settings,
    Sun,
    Moon,
    Menu,
    X,
    Birdhouse
} from 'lucide-react';
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from "@/app/components/AuthProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    NavigationMenu,
    //   NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useTheme } from "next-themes"

export default function Header() {
    const { setTheme } = useTheme()
    const { initialized, account, accessToken, me, meLoading, login, logout } = useAuth()
    const navigation = [
        { name: '仪表盘', href: '#', icon: LayoutDashboard, current: true },
        { name: '游戏', href: 'https://game.steamsda.com', icon: Birdhouse, current: false, target: "_blank" },
        { name: '客户', href: '#', icon: Users, current: false, target: undefined },
        { name: '设置', href: '#', icon: Settings, current: false, target: undefined },
    ];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (

        <header className={`sticky top-0 z-50 shadow-md bg-background`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className={`h-8 w-8 rounded-md`} >
                                <Image src="/logo.png" alt="logo" width={100} height={100} />
                            </div>
                            <span className={`ml-2 text-xl font-bold`}>
                                Steam Sda
                            </span>
                        </div>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <NavigationMenu>
                                <NavigationMenuList className="flex-wrap">
                                    {navigation.map((item) => (
                                        <NavigationMenuItem key={item.name}>
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`block pl-3 pr-4 py-2 text-base font-medium hover:text-2xl`}
                                                target={item.target}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-3 h-5 w-5" />
                                                    {item.name}
                                                </div>
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center mr-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'} size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        明亮
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        暗黑
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        系统
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {(me || account) ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="mr-4 hidden md:flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        {account?.name ?? account?.username ?? (me?.me as { displayName?: string } | undefined)?.displayName ?? '我的'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="px-2 py-1.5 text-sm">
                                        <div className="font-medium">{account?.name ?? account?.username ?? (me?.me as { displayName?: string } | undefined)?.displayName ?? '我的'}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[16rem]">
                                            {(me?.me as { mail?: string; userPrincipalName?: string } | undefined)?.mail
                                                ?? (me?.me as { mail?: string; userPrincipalName?: string } | undefined)?.userPrincipalName
                                                ?? '—'}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {meLoading ? '加载中…' : `已购订阅：${(me?.products as unknown[])?.length ?? 0} 项`}
                                        </div>
                                    </div>
                                    <DropdownMenuItem onClick={() => logout()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        登出
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                className="mr-4 hidden md:block"
                                disabled={!initialized}
                                onClick={() => login()}
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                登录
                            </Button>
                        )}

                        {/* 移动端菜单按钮 */}
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 移动端导航菜单 */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                        <div className="px-4 py-2">
                            {(me || account) ? (
                                <Button
                                    variant="outline"
                                    className="w-full mb-2"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    登出（{account?.name ?? account?.username ?? (me?.me as { displayName?: string } | undefined)?.displayName ?? '我的'}）
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full mb-2"
                                    disabled={!initialized}
                                    onClick={() => login()}
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    登录
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );

}
"use client";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Settings,
    Sun,
    Moon,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Switch } from '@/components/ui/switch';

export default function Header() {
    const navigation = [
        { name: '仪表盘', href: '#', icon: LayoutDashboard, current: true },
        { name: '产品', href: '#', icon: ShoppingCart, current: false },
        { name: '客户', href: '#', icon: Users, current: false },
        { name: '设置', href: '#', icon: Settings, current: false },
    ];

    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (

        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className={`h-8 w-8 rounded-md ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`} >
                                <Image src="/logo.png" alt="logo" width={100} height={100} />
                            </div>
                            <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Steam Sda
                            </span>
                        </div>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${item.current
                                        ? `${darkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`
                                        : `${darkMode ? 'border-transparent text-gray-300 hover:text-white hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                                        }`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center mr-4">
                            <Sun className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <Switch
                                checked={darkMode}
                                onCheckedChange={setDarkMode}
                                className="mx-2"
                            />
                            <Moon className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                        </div>

                        <Button variant="outline" className="mr-4 hidden md:block">
                            登录
                        </Button>

                        <Button className="hidden md:block">
                            注册
                        </Button>

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
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${item.current
                                    ? `${darkMode ? 'bg-blue-900 border-blue-500 text-white' : 'bg-blue-50 border-blue-500 text-blue-700'}`
                                    : `${darkMode ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`
                                    }`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                        <div className="px-4 py-2">
                            <Button variant="outline" className="w-full mb-2">
                                登录
                            </Button>
                            <Button className="w-full">
                                注册
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );

}
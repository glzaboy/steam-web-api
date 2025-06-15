"use client";
import { useState } from 'react';
import Link from 'next/link';


export default function Footer() {
    const [darkMode] = useState(false);
    return (
        <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} py-8`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Cloud Steam Sda
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            提供卓越的数字解决方案，帮助企业实现数字化转型，提升业务效率。
                        </p>
                    </div>

                    <div>
                        <h4 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            产品
                        </h4>
                        <ul className="space-y-2">
                            {['功能', '解决方案', '定价', '更新日志'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className={`text-sm hover:underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            资源
                        </h4>
                        <ul className="space-y-2">
                            {['文档', '教程', '博客', '支持'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className={`text-sm hover:underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            联系我们
                        </h4>
                        <address className={`not-italic text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div>北京市朝阳区科技园区</div>
                            <div className="mt-1">info@brandname.com</div>
                            <div className="mt-1">+86 10 1234 5678</div>
                        </address>
                    </div>
                </div>

                <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        &copy; {new Date().getFullYear()} BrandName. 保留所有权利。
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {['条款', '隐私', 'Cookie 政策'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
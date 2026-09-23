'use client';
// 根据您的数据结构定义类型
interface AllProduct {
    id: number;
    label: string;
    value: string;
    createdAt: string;
    updateAt: string;
}

interface UserProduct {
    id: number;
    userId: string;
    productName: string; // 对应allProducts中的value
    expTime: string;
    createdAt: string;
    updateAt: string;
}

interface CombinedProduct {
    id: number;
    label: string;
    value: string;
    isActive: boolean;
    expTime?: string;
}
interface me {
    "@odata.context": string;
    userPrincipalName: string;
    id: string;
    displayName: string;
    surname: string;
    givenName: string;
    preferredLanguage: string;
    mail: string;
    mobilePhone: null;
    jobTitle: null;
    officeLocation: null;
    businessPhones: never[];
    ageGroup: string;
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";

export const ProductList = () => {
    const { me } = useAuth();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<CombinedProduct[]>([]);

    // 直接消费 AuthProvider 已拉好的 me（浏览器登录 / 桌面端注入头都会更新它），
    // 对 me 变化做响应：登录完成、me 由 null 变为数据时会自动重算产品列表。
    useEffect(() => {
        if (!me) {
            // 未登录：清空并结束加载，等待登录后 me 变化再次触发
            setProducts([]);
            setLoading(false);
            return;
        }
        try {
            const allProducts = (me.allProducts as AllProduct[]) ?? [];
            const userProducts = (me.products as UserProduct[]) ?? [];

            // 合并产品数据
            const combined = allProducts.map(product => {
                const userProduct = userProducts.find(
                    p => p.productName === product.value
                );

                return {
                    id: product.id,
                    label: product.label,
                    value: product.value,
                    isActive: !!userProduct,
                    expTime: userProduct?.expTime
                };
            });

            setProducts(combined);
        } catch (error) {
            console.error("合并产品数据失败:", error);
        } finally {
            setLoading(false);
        }
    }, [me]);
    // 开通单个产品
    const activateProduct = (productValue: string) => {
        console.log(`开通产品: ${productValue}`);
        alert(`已开通产品: ${products.find(p => p.value === productValue)?.label}`);

        // 更新状态
        setProducts(prev => prev.map(p =>
            p.value === productValue
                ? { ...p, isActive: true, expTime: "2055-06-22T11:29:13.000Z" }
                : p
        ));
    };

    // 一键开通所有未开通产品
    const activateAllProducts = () => {
        const inactiveProducts = products.filter(p => !p.isActive);

        if (inactiveProducts.length === 0) {
            alert("您已开通所有产品");
            return;
        }

        const productNames = inactiveProducts.map(p => p.label).join(", ");
        console.log("一键开通所有产品");
        alert(`已开通所有产品: ${productNames}`);

        // 更新状态
        setProducts(prev => prev.map(p =>
            !p.isActive
                ? { ...p, isActive: true, expTime: "2055-06-22T11:29:13.000Z" }
                : p
        ));
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 text-center">
                <p>加载产品数据中...</p>
            </div>
        );
    }
    if (!me) {
        return (
            <div className="container mx-auto py-8 text-center text-gray-500">
                <p>请先登录以查看您的产品功能。</p>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">


                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">我的产品功能</h1>
                    <Button
                        onClick={activateAllProducts}
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        一键开通所有产品
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onActivate={activateProduct}
                    />
                ))}
            </div>
        </div>
    );
}
// 产品卡片组件
function ProductCard({
    product,
    onActivate
}: {
    product: CombinedProduct;
    onActivate: (value: string) => void;
}) {
    return (
        <Card className={cn(
            "h-full flex flex-col transition-all hover:shadow-lg",
        )}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{product.label}</CardTitle>
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    )}>
                        {product.isActive ? "已开通" : "未开通"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="grow flex flex-col">
                <div className="grow">
                    {/* 这里可以添加产品描述或其他信息 */}
                    {product.isActive && product.expTime && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-600">有效期至</p>
                            <p className="text-blue-600 font-semibold">
                                {new Date(product.expTime).toLocaleDateString(
                                    "zh-CN",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {!product.isActive && (
                    <div className="mt-6">
                        <Button
                            onClick={() => onActivate(product.value)}
                            variant="outline"
                            className="w-full"
                        >
                            立即开通
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
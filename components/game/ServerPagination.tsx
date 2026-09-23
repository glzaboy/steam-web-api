import {
    Pagination as ShadPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ServerPaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
    pageParam?: string;
    showInfo?: boolean;
    className?: string;
}

export default function ServerPagination({
    currentPage,
    totalPages,
    baseUrl = "/",
    pageParam = "page",
    showInfo = true,
    className = "",
}: ServerPaginationProps) {
    // 如果没有分页或只有一页，不显示分页组件
    if (totalPages <= 1) {
        return null;
    }

    // 确保当前页在有效范围内
    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    // 生成页码数组（带省略号逻辑）
    const generatePageNumbers = () => {
        const delta = 2; // 当前页前后显示的页码数
        const range: (number | string)[] = [];

        // 总是显示第一页
        range.push(1);

        // 添加当前页附近的页码
        for (let i = safeCurrentPage - delta; i <= safeCurrentPage + delta; i++) {
            if (i > 1 && i < totalPages && !range.includes(i)) {
                range.push(i);
            }
        }

        // 总是显示最后一页
        if (totalPages > 1 && !range.includes(totalPages)) {
            range.push(totalPages);
        }

        // 排序并去重
        const sorted = [...new Set(range)].sort((a, b) => Number(a) - Number(b));

        // 添加省略号
        const result: (number | string)[] = [];
        sorted.forEach((page, index) => {
            const prev = sorted[index - 1];
            if (prev && Number(page) - Number(prev) > 1) {
                result.push("...");
            }
            result.push(page);
        });

        return result;
    };

    const pageNumbers = generatePageNumbers();

    // 服务器端构建URL（不使用window对象）
    const buildUrl = (page: number) => {
        if (page === 1) {
            return baseUrl;
        }
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${pageParam}=${page}`;
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <ShadPagination>
                <PaginationContent>
                    {/* 上一页按钮 */}
                    <PaginationItem>
                        <PaginationPrevious
                            href={safeCurrentPage > 1 ? buildUrl(safeCurrentPage - 1) : "#"}
                            aria-disabled={safeCurrentPage <= 1}
                            className={
                                safeCurrentPage <= 1
                                    ? "pointer-events-none opacity-50"
                                    : "hover:bg-accent"
                            }
                        />
                    </PaginationItem>

                    {/* 页码按钮 */}
                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={buildUrl(page as number)}
                                    isActive={safeCurrentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* 下一页按钮 */}
                    <PaginationItem>
                        <PaginationNext
                            href={safeCurrentPage < totalPages ? buildUrl(safeCurrentPage + 1) : "#"}
                            aria-disabled={safeCurrentPage >= totalPages}
                            className={
                                safeCurrentPage >= totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "hover:bg-accent"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </ShadPagination>

            {/* 分页信息 */}
            {showInfo && (
                <div className="text-sm text-muted-foreground">
                    第 {safeCurrentPage} 页，共 {totalPages} 页
                </div>
            )}
        </div>
    );
}

import { getDbAsync } from "@/app/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flame } from 'lucide-react';
import GameList from "@/components/game/GameList";
import { games } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import ServerPagination from "@/components/game/ServerPagination";

export const revalidate = 3600; // 缓存 1 小时

const ITEMS_PER_PAGE = 8;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDbAsync();
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
  });
  const title = category ? `${category.name} - 游戏分类` : "游戏分类";
  return {
    title,
    description: category ? `浏览 ${category.name} 分类下的全部游戏` : "游戏分类列表",
  };
}

export default async function CategoryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: number }>;
}) {
  const { slug } = await params;
  const q = await searchParams;
  const page = q.page ?? 1;

  const db = await getDbAsync();
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
  });
  if (!category) {
    notFound();
  }
  const [categoryGames, totalResult] = await Promise.all([
    db.query.games.findMany({
      where: (games, { eq }) => eq(games.categoryId, category.id),
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      orderBy: (games, { desc }) => [desc(games.sort)],
      with: { category: true },
    }),
    db.select({ count: count() }).from(games).where(eq(games.categoryId, category.id)),
  ]);
  const totalGames = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);

  return (
    <main className="grow">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">{category.name}</h2>
          </div>
          {categoryGames.length > 0 ? (
            <>
              <GameList games={categoryGames} />
              <div className="mt-12">
                <ServerPagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl={`/categories/${category.slug}`}
                  pageParam="page"
                  showInfo={true}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">该分类下暂无游戏</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

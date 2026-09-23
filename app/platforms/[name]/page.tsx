
export default async function Home({
    params,
}: {
    params: Promise<{ name: string }>
}) {
    const { name } = await params;
    return <><main className="grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            当前游戏平台: {name}
        </div>
    </main></>
}

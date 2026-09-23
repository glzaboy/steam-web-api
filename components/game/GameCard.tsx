// components/game/GameCard.tsx
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Gamepad2 } from 'lucide-react';
import Image from 'next/image';

interface GameCardProps {
    game: {
        id: number;
        title: string;
        description: string | null;
        coverImage: string | null;
        romUrl: string;
        coreCype: string;
        categoryId: number | null;
        isHot: boolean | null;
        category: {
            sort: number | null;
            name: string;
            slug: string;
            icon: string | null;
            enable: boolean | null;
            id: number;
            createdAt: Date;
            updateAt: Date;
        } | null;
    };
    showCategory?: boolean;
}

export default function GameCard({ game, showCategory = true }: GameCardProps) {
    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={game.coverImage || '/placeholder-game.jpg'}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={true}
                />
                {game.isHot && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        <Flame className="h-3 w-3 mr-1" />
                        热门
                    </Badge>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{game.title}</h3>
                {showCategory && game.category && (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Gamepad2 className="h-3 w-3 mr-1" />
                        {game.category.name}
                    </div>
                )}
                {game.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {game.description}
                    </p>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                    <a href={`/game/${game.id}`}>查看详情</a>
                </Button>
            </CardFooter>
        </Card>
    );
}

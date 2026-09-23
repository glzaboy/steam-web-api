import { Loader2 } from "lucide-react";

export function Loading({ text = "加载中..." }: { text?: string }) {
    return (

        <div className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{text}</span>
        </div>
    );
}

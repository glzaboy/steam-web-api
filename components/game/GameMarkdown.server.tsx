// components/GameMarkdown.server.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GameMarkdownProps {
    /** 从数据库读取的原始Markdown文本 */
    markdownContent: string;
}

export default async function GameMarkdown({ markdownContent }: GameMarkdownProps) {
    // 服务器端渲染：Markdown直接在这里被转换为HTML
    return (
        <article className="prose prose-lg max-w-none prose-headings:text-game-primary prose-strong:text-game-accent">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
            </ReactMarkdown>
        </article>
    );
}

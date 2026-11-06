import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function PostView({ title, subtitle, content }) {
  return (
    <div className="max-w-lg w-full mx-auto">
      <article
        className={`rounded-xl flex-col max-w-5xl mx-auto px-6 py-4 flex gap-3 min-w-0 w-full flex-1`}
      >
        <header className="mb-8 flex flex-col gap-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>
        <hr className="opacity-70 w-full h-px" />

        <div className="rte-content">
          <div className="ProseMirror min-h-0! p-0!">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}

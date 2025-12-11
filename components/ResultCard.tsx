'use client';

import ReactMarkdown from 'react-markdown';

interface ResultCardProps {
  markdown: string;
}

/**
 * 结果展示组件 - GPT 风格（浅色主题）
 * 使用 react-markdown 渲染 Markdown 内容
 */
export default function ResultCard({ markdown }: ResultCardProps) {
  return (
    <div className="w-full">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-semibold mt-8 mb-4 text-gray-900 leading-tight"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-semibold mt-6 mb-3 text-gray-900 leading-tight"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-medium mt-5 mb-2 text-gray-800 leading-tight"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="mb-4 text-gray-700 leading-7 text-[15px]"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc list-outside mb-4 ml-6 space-y-2 text-gray-700 leading-7 text-[15px]"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-outside mb-4 ml-6 space-y-2 text-gray-700 leading-7 text-[15px]"
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li className="pl-2" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-gray-700" {...props} />
            ),
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code
                  className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 border border-gray-200"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 border border-gray-200 overflow-x-auto mb-4"
                  {...props}
                />
              ),
            pre: ({ node, ...props }) => (
              <pre className="mb-4" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className="min-w-full text-[15px] text-gray-700 border-separate border-spacing-0"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-3 py-2 text-left font-semibold text-gray-900"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="px-3 py-2"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-6 border-gray-200" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

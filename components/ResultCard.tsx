'use client';

import ReactMarkdown from 'react-markdown';

interface ResultCardProps {
  markdown: string;
}

/**
 * 结果展示卡片组件
 * 使用 react-markdown 渲染 Markdown 内容
 */
export default function ResultCard({ markdown }: ResultCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-3 text-gray-700 leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="ml-4" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}


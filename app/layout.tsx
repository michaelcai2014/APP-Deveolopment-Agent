import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'App 开发评估 Agent',
  description: '输入你的 App 想法，AI 将为你生成一份详细的开发评估报告',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}



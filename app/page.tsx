'use client';

import { useState } from 'react';
import ResultCard from '@/components/ResultCard';
import { EvaluateRequest } from '@/types';

export default function Home() {
  // 表单状态
  const [description, setDescription] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([]);

  // UI 状态
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 平台选项
  const platformOptions = [
    { value: 'web', label: 'Web' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
    { value: 'mini-program', label: '小程序' },
  ];

  // 处理平台多选
  const handlePlatformChange = (value: string) => {
    setTargetPlatforms((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!description.trim()) {
      setError('请填写 App 功能描述');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestBody: EvaluateRequest = {
        description: description.trim(),
        ...(targetPlatforms.length > 0 && { targetPlatforms }),
      };

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '评估失败，请稍后重试');
      }

      const data = await response.json();
      setResult(data.markdown);
    } catch (err: any) {
      setError(err.message || '评估失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 顶部标题 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            App 开发评估 Agent
          </h1>
          <p className="text-lg text-gray-600">
            输入你的 App 想法，AI 将为你生成一份详细的开发评估报告
          </p>
        </header>

        {/* 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              描述你的 App 想法
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 功能描述输入框 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App 功能描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例如：想做一个类似小红书的内容分享 App，需要用户登录、发图文、点赞评论、关注、简单数据看板，支持 iOS 和 Android……"
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* 目标平台（多选） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标平台（可多选）
                </label>
                <div className="flex flex-wrap gap-3">
                  {platformOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={targetPlatforms.includes(option.value)}
                        onChange={() => handlePlatformChange(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? '生成中...' : '生成开发评估'}
              </button>

              {/* 错误提示 */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <div className="font-semibold mb-2">❌ 错误提示</div>
                  <div className="whitespace-pre-line leading-relaxed">
                    {error}
                  </div>
                  {error.includes('配额') && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <a 
                        href="https://platform.openai.com/account/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        → 前往 OpenAI 账户计费页面检查余额
                      </a>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* 右侧：结果展示区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              评估结果
            </h2>

            {/* 加载状态 */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">
                  正在生成评估报告，请稍候...
                </p>
              </div>
            )}

            {/* 结果展示 */}
            {result && !loading && <ResultCard markdown={result} />}

            {/* 初始提示 */}
            {!loading && !result && (
              <div className="text-center py-12 text-gray-500">
                <p>在左侧输入你的 App 想法，然后点击「生成开发评估」</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

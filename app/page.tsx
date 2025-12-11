'use client';

import { useState } from 'react';
import ResultCard from '@/components/ResultCard';
import FileUpload from '@/components/FileUpload';
import { EvaluateRequest } from '@/types';

export default function Home() {
  // 表单状态
  const [description, setDescription] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
    if (!description.trim() && uploadedFiles.length === 0) {
      setError('请填写 App 功能描述或上传相关文件');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 如果有文件，先上传并解析
      let fileContents = '';
      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append('files', file);
        });

        const parseResponse = await fetch('/api/parse-files', {
          method: 'POST',
          body: formData,
        });

        const parseData = await parseResponse.json();
        
        // 检查解析是否成功
        if (!parseResponse.ok || parseData.error) {
          throw new Error(parseData.error || '文件解析失败，请检查文件格式或稍后重试');
        }
        
        fileContents = parseData.content || '';
        
        // 如果文件解析后内容为空，且用户也没有填写描述，提示错误
        if (!fileContents.trim() && !description.trim()) {
          throw new Error('文件解析后未提取到有效内容，请填写功能描述或重新上传文件');
        }
      }

      // 构建评估请求
      const requestBody: EvaluateRequest = {
        description: description.trim() || (fileContents ? '（用户通过上传文件提供需求）' : ''),
        ...(targetPlatforms.length > 0 && { targetPlatforms }),
        ...(fileContents && { fileContent: fileContents }),
      };
      
      // 最终验证：至少要有描述或文件内容
      if (!requestBody.description.trim() && !requestBody.fileContent?.trim()) {
        throw new Error('请填写 App 功能描述或上传相关文件');
      }

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* 顶部标题栏 */}
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">
            App 开发评估 Agent
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            输入你的 App 想法或上传相关文档，AI 将为你生成详细的开发评估报告
          </p>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 输入区域 */}
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 功能描述输入框 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App 功能描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例如：想做一个类似小红书的内容分享 App，需要用户登录、发图文、点赞评论、关注、简单数据看板，支持 iOS 和 Android……"
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-900 placeholder-gray-400 text-[15px] leading-6 shadow-sm"
                />
              </div>

              {/* 文件上传 */}
              <FileUpload
                onFilesChange={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              {/* 目标平台（多选） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标平台（可多选）
                </label>
                <div className="flex flex-wrap gap-3">
                  {platformOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={targetPlatforms.includes(option.value)}
                        onChange={() => handlePlatformChange(option.value)}
                        className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <span>生成开发评估</span>
                )}
              </button>

              {/* 错误提示 */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <div className="font-semibold mb-2">❌ 错误提示</div>
                  <div className="whitespace-pre-line leading-relaxed">
                    {error}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* 结果展示区域 */}
          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="prose prose-lg max-w-none">
                <ResultCard markdown={result} />
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {loading && !result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-3 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                <span className="text-sm">正在分析并生成评估报告...</span>
              </div>
            </div>
          )}

          {/* 初始提示 */}
          {!loading && !result && (
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
              <p>👆 在上方输入你的 App 想法或上传相关文档，然后点击「生成开发评估」</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

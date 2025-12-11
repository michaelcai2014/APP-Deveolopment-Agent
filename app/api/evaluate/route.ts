import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { EvaluateRequest } from '@/types';

/**
 * POST /api/evaluate
 * 接收用户输入，调用阿里云通义千问 API，返回 Markdown 格式的评估结果
 */
export async function POST(request: NextRequest) {
  try {
    const body: EvaluateRequest = await request.json();
    const { description } = body;

    // 验证必填字段
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: '产品描述不能为空' },
        { status: 400 }
      );
    }

    // 调用通义千问 API
    const options: EvaluateRequest = {
      ...body,
      description: description.trim(),
    };

    const markdown = await callOpenAI(options);

    // 返回 Markdown 文本
    return NextResponse.json({ markdown });
  } catch (error: any) {
    console.error('评估错误:', error);

    // 返回友好的错误信息
    const errorMessage = error.message || '评估失败，请稍后重试。请检查 QWEN_API_KEY 是否正确配置。';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

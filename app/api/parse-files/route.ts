import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/parse-files
 * 解析上传的文件（图片 OCR、文档解析）
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '未上传文件' },
        { status: 400 }
      );
    }

    let allContent = '';

    for (const file of files) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = file.size;
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

      // 图片文件：使用通义千问视觉模型进行 OCR
      if (fileType.startsWith('image/')) {
        // 检查文件大小
        if (fileSize > MAX_IMAGE_SIZE) {
          allContent += `\n\n【文件：${fileName}（图片，${(fileSize / 1024 / 1024).toFixed(2)}MB）】\n注意：图片文件较大（超过 5MB），可能影响解析速度。建议压缩后再上传。`;
          continue;
        }

        const imageBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        // 调用通义千问视觉模型
        const qwenApiKey = process.env.QWEN_API_KEY;
        if (!qwenApiKey) {
          throw new Error('QWEN_API_KEY 未配置');
        }

        const visionResponse = await fetch(
          'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${qwenApiKey}`,
            },
            body: JSON.stringify({
              model: 'qwen-vl-max', // 使用通义千问视觉模型
              input: {
                messages: [
                  {
                    role: 'user',
                    content: [
                      {
                        image: `data:${fileType};base64,${base64Image}`,
                      },
                      {
                        text: '请详细描述这张图片中的所有文字和内容，包括任何文档、图表、脑图、流程图等。如果是产品设计图或需求文档，请提取所有功能点和需求描述。',
                      },
                    ],
                  },
                ],
              },
              parameters: {
                max_tokens: 2000,
              },
            }),
          }
        );

        if (!visionResponse.ok) {
          const errorData = await visionResponse.json().catch(() => ({}));
          const errorMsg = errorData.message || errorData.error?.message || '图片解析失败';
          
          // 如果是配额错误，给出更友好的提示
          if (errorMsg.includes('quota') || errorMsg.includes('余额') || errorMsg.includes('余额不足')) {
            allContent += `\n\n【文件：${fileName}（图片）】\n注意：图片解析失败，可能是 API 配额不足。请检查 DashScope 账户余额。`;
            continue;
          }
          
          allContent += `\n\n【文件：${fileName}（图片）】\n注意：图片解析失败（${errorMsg}）。请尝试压缩图片或转换为文本格式。`;
          continue;
        }

        const visionData = await visionResponse.json();
        const imageContent = visionData.output?.choices?.[0]?.message?.content || '';

        allContent += `\n\n【文件：${fileName}（图片）】\n${imageContent}`;
      }
      // 文本文件：直接读取
      else if (fileType.startsWith('text/')) {
        const text = await file.text();
        allContent += `\n\n【文件：${fileName}（文本）】\n${text}`;
      }
      // PDF、Word、Excel 等文档：返回提示（需要额外库支持）
      else {
        allContent += `\n\n【文件：${fileName}（${fileType}）】\n注意：此文件类型需要额外配置解析库，当前版本暂不支持自动解析。请将内容复制粘贴到功能描述中，或转换为图片/文本格式上传。`;
      }
    }

    // 检查是否有有效内容
    const finalContent = allContent.trim();
    
    if (!finalContent) {
      return NextResponse.json(
        { 
          error: '文件解析后未提取到有效内容。请确保文件包含文字内容，或尝试填写功能描述。',
          content: '',
          fileCount: files.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      content: finalContent,
      fileCount: files.length,
    });
  } catch (error: any) {
    console.error('文件解析错误:', error);

    return NextResponse.json(
      {
        error:
          error.message ||
          '文件解析失败，请稍后重试。如果文件较大，请尝试压缩或分批上传。',
      },
      { status: 500 }
    );
  }
}


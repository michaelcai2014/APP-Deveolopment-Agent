/**
 * 阿里云通义千问 API 封装
 * 包含 SYSTEM_PROMPT 和调用逻辑
 */

import { EvaluateRequest } from '@/types';

export const SYSTEM_PROMPT = `
你是专业的开发评估助手，负责生成《App MVP 开发评估报告》。

🎯 核心目标：针对用户输入的 App 想法，生成一份逻辑清晰、美观、段落结构完善、项目可落地的 MVP 开发评估报告。

🧱 写作固定规则（必须严格遵守）：

1. 开发周期必须统一为：6–8 周（2 个月内）
   - 不得超出 8 周
   - 每周要有清晰的里程碑

2. 费用必须统一为：5–10 万人民币
   - 不允许给区间以外的数值
   - 成本说明为整体投入，不拆分人员单价

3. 输出重点放在：MVP 主线功能闭环
   - 必须从用户输入中提炼 1–3 个最关键的主线功能
   - 例如：用户注册 → 发布内容 → 内容展示
   - 例如：用户下单 → 支付 → 订单管理
   - 例如：用户发帖 → 浏览 → 点赞/评论
   - ⚠️ 要始终强调：MVP 不是完整产品，只做最小可验证闭环

📌 输出格式模板（严格按此结构，不得遗漏标题）：

# 《App MVP 开发评估报告》

## 1. 项目目标概述（简洁 3–5 句）
用自己的话总结用户想法，指出核心价值，强调 MVP 做的是最小验证路径。

## 2. MVP 主线功能拆解（仅 1–3 个闭环）
以表格形式展示：

| 主线功能 | 功能说明 | 复杂度 |
|---------|---------|--------|
| 核心功能 1 | 描述该功能在 MVP 中的作用及最小实现方式 | 简单/中等 |
| 核心功能 2 | 若用户需求涉及第二条主线，则写入 | 简单/中等 |
| 核心功能 3 | 若有必要才写，否则省略 | 中等 |

⚠️ 不允许超过 3 个主线功能
⚠️ 不要写大量完整产品功能

## 3. MVP 开发周期（固定 6–8 周）
用周为单位写清楚每阶段目标，例如：

**第 1 周｜需求确认 & 原型设计**
- 细化用户主线场景
- 原型图 + UI 基础规范

**第 2–3 周｜核心功能开发（主线 1）**
- 前端实现
- 后端 API
- 简单后台（如有必要）

**第 4–5 周｜主线 2 / 其他必要功能**
- 主线功能 2
- 列表/详情页

**第 6 周｜联调、自测、修复问题**

**第 7–8 周｜上线前准备 & 预发布环境**
- beta 测试
- 部署 & 上架协助

## 4. 推荐技术栈（统一风格）
- **前端**：Flutter（移动端）或 React（Web）
- **后端**：Java Spring Boot
- **数据库**：PostgreSQL
- **存储**：对象存储服务（OSS/S3）
- **部署**：Docker + 云服务器

不得推荐过度复杂的架构（如微服务、K8s 等）

## 5. 预计开发成本（5–10 万人民币）
用一段话说明成本范围：

本项目的 MVP 实现路径明确，围绕 1–3 条核心主线展开，预估整体开发成本约 ¥50,000–¥100,000 RMB（含前端、后端、测试、项目管理）。

如果功能增加或希望提升设计质量，可在此基础上做进一步预算调整。

## 6. 风险提示与优化建议（3–5 条）
示例方向：
- 需求不够明确时，MVP 功能易膨胀
- 内容平台涉及图片/视频，需要提前规划存储和压缩方案
- 推荐算法在 MVP 阶段不做复杂模型，先人工规则
- 后台管理建议保持最小化，只做内容审核

🧠 整体语言要求：
- 简洁、专业、逻辑清晰
- 不出现 AI 术语
- 不出现过多假设
- 不对用户进行营销

🚀 输出模式：
每次都必须只输出最终的《App MVP 开发评估报告》，不显示思考过程，不显示多余文本。
`;

/**
 * 调用阿里云通义千问 API
 * 支持模型：qwen-mini（最经济）、qwen-turbo（推荐）、qwen-plus、qwen-max
 */
export async function callOpenAI(options: EvaluateRequest): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY;

  if (!apiKey) {
    throw new Error('QWEN_API_KEY 未配置，请在 .env.local 文件中设置');
  }

  // 构建用户消息
  const userMessage = buildUserMessage(options);

  // 通义千问 API 端点
  const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  
  // 选择模型：qwen-mini（最经济）或 qwen-turbo（推荐）
  const model = process.env.QWEN_MODEL || 'qwen-turbo';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      parameters: {
        temperature: 0.3, // 较低的温度，保证相对稳定
        max_tokens: 3000, // 增加输出长度以支持完整报告格式
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error?.message || `通义千问 API 调用失败: ${response.statusText}`;
    
    // 检测配额超限错误
    if (errorMessage.includes('quota') || errorMessage.includes('余额') || errorMessage.includes('余额不足') || errorMessage.includes('exceeded')) {
      throw new Error(
        'API 配额已用完或余额不足。请检查你的阿里云账户余额和计费设置。\n\n解决方案：\n1. 访问 https://dashscope.console.aliyun.com/overview 检查账户余额\n2. 在 DashScope 控制台充值\n3. 检查使用限制和配额设置'
      );
    }
    
    throw new Error(`通义千问 API 错误: ${errorMessage}`);
  }

  const data = await response.json();
  
  // 通义千问返回格式：{ output: { text: "..." } }
  const content = data.output?.text || data.output?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('通义千问 API 返回内容为空');
  }

  return content;
}

/**
 * 构建用户消息
 * 注意：不再使用支付、AI、后台管理等选项，只关注核心功能描述和目标平台
 */
function buildUserMessage(options: EvaluateRequest): string {
  const { description, targetPlatforms } = options;

  let message = `我想开发的 App 功能描述：\n${description}\n\n`;

  if (targetPlatforms && targetPlatforms.length > 0) {
    message += `目标平台：${targetPlatforms.join('、')}\n`;
  }

  return message.trim();
}


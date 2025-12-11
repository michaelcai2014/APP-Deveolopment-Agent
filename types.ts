/**
 * 类型定义
 */

export interface EvaluateRequest {
  description: string; // 用户自然语言描述的 App 需求（必填）
  targetPlatforms?: string[]; // ['web', 'ios', 'android', 'mini-program']（可选）
  hasAdminPanel?: boolean; // 是否需要后台管理（可选）
  hasPayment?: boolean; // 是否包含支付/订阅（可选）
  hasAI?: boolean; // 是否包含 AI 功能（可选）
}

export interface EvaluateResponse {
  markdown: string; // Markdown 格式的评估结果
}


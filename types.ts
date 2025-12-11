/**
 * 类型定义
 */

export interface EvaluateRequest {
  description: string; // 用户自然语言描述的 App 需求（必填）
  targetPlatforms?: string[]; // ['web', 'ios', 'android', 'mini-program']（可选）
  fileContent?: string; // 从上传文件中解析出的内容（可选）
}

export interface EvaluateResponse {
  markdown: string; // Markdown 格式的评估结果
}


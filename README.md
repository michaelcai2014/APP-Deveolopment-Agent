# App 开发评估 Agent

一个基于 Next.js + TypeScript + 阿里云通义千问 API 的 Web 工具，输入你的 App 想法，AI 将为你生成一份详细的开发评估报告。

## 功能特点

- ✅ 自然语言输入 App 功能描述
- ✅ 支持多平台选择（Web / iOS / Android / 小程序）
- ✅ 可配置选项（后台管理、支付/订阅、AI 功能）
- ✅ AI 生成详细的 Markdown 格式评估报告
- ✅ 包含项目概述、功能模块拆分、开发周期、技术栈推荐、工作量预估、风险提示等
- ✅ 简洁现代的 UI 设计（Tailwind CSS）
- ✅ 完整的错误处理和加载状态

## 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **AI API**：阿里云通义千问 API（Qwen）
- **Markdown 渲染**：react-markdown

## 快速开始

### 1. 安装依赖

```bash
cd app-mvp-estimator
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（在 `app-mvp-estimator` 目录下）：

```bash
QWEN_API_KEY=your_qwen_api_key_here
QWEN_MODEL=qwen-turbo
```

**获取 API Key**：
1. 访问 [DashScope 控制台](https://dashscope.console.aliyun.com/overview)
2. 登录阿里云账号
3. 在「API Key 管理」中创建新的 API Key
4. 复制 API Key 到 `.env.local` 文件

**模型选择**：
- `qwen-mini`：最经济（适合预算有限）
- `qwen-turbo`：推荐使用（性价比高）
- `qwen-plus`：性能更强
- `qwen-max`：最强性能

**注意**：如果没有配置 `QWEN_API_KEY`，系统会抛出错误提示。详细配置请查看 [通义千问配置指南.md](./通义千问配置指南.md)

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
app-mvp-estimator/
├── app/
│   ├── api/
│   │   └── evaluate/
│   │       └── route.ts          # POST /api/evaluate 接口
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── components/
│   └── ResultCard.tsx            # Markdown 结果展示组件
├── lib/
│   └── openai.ts                 # 通义千问 API 封装和 SYSTEM_PROMPT
├── types.ts                      # TypeScript 类型定义
├── .env.local                    # 环境变量（需要自己创建）
├── next.config.js                # Next.js 配置
├── tailwind.config.js            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 依赖配置
```

## 使用说明

1. **填写 App 功能描述**：在左侧文本框中输入你的 App 想法（必填）
2. **选择目标平台**：可选择 Web / iOS / Android / 小程序（可多选）
3. **配置其他选项**：选择是否需要后台管理、支付/订阅、AI 功能（可选）
4. **生成评估**：点击「生成开发评估」按钮
5. **查看结果**：右侧会显示 AI 生成的 Markdown 格式评估报告

## API 接口说明

### POST /api/evaluate

**请求体**：
```typescript
{
  description: string;            // 必填：App 功能描述
  targetPlatforms?: string[];     // 可选：['web', 'ios', 'android', 'mini-program']
  hasAdminPanel?: boolean;         // 可选：是否需要后台管理
  hasPayment?: boolean;            // 可选：是否包含支付/订阅
  hasAI?: boolean;                 // 可选：是否包含 AI 功能
}
```

**响应**：
```typescript
{
  markdown: string;  // Markdown 格式的评估报告
}
```

## 评估报告内容

AI 生成的评估报告包含以下内容：

1. **项目概述**：用自己的话重述项目目标（不超过 200 字）
2. **功能模块拆分**：列出功能模块并标记复杂度（简单/中等/复杂）
3. **开发周期**：基于 2~3 人开发团队的 MVP 级别开发周期，按周划分里程碑
4. **技术栈推荐**：推荐前端/后端/数据库/部署方案（偏向 Java Spring Boot + Flutter/React）
5. **工作量预估**：前端/后端/测试/项目管理的人日区间
6. **风险和注意事项**：至少 3 点风险提示
7. **免责声明**：说明这是粗略估算

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量 `OPENAI_API_KEY`
4. 部署完成

### 其他平台

项目使用标准的 Next.js App Router，可以部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- Render
- 自建服务器（Node.js 环境）

## 注意事项

- 确保在生产环境中正确配置 `QWEN_API_KEY`
- API 调用会产生费用，通义千问通常有免费额度，请注意控制使用量
- 评估结果仅供参考，实际开发需要详细需求评审和技术方案评审
- 默认使用 `qwen-turbo` 模型，可在 `.env.local` 中通过 `QWEN_MODEL` 修改
- 推荐使用 `qwen-turbo`（性价比高）或 `qwen-mini`（最经济）

## 许可证

MIT License

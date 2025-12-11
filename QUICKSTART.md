# 快速开始指南

## ✅ 项目已完成

所有代码已经按照需求实现完成，包括：

1. ✅ Next.js + TypeScript + App Router + Tailwind CSS 项目结构
2. ✅ POST /api/evaluate 接口，调用阿里云通义千问 API
3. ✅ lib/openai.ts 封装，包含 SYSTEM_PROMPT
4. ✅ 前端页面：输入区域 + 结果展示区域
5. ✅ Markdown 渲染组件（react-markdown）
6. ✅ 错误处理和加载状态
7. ✅ 类型定义（types.ts）

## 🚀 立即开始使用

### 1. 配置环境变量

在 `app-mvp-estimator` 目录下创建 `.env.local` 文件：

```bash
QWEN_API_KEY=sk-your-qwen-api-key-here
QWEN_MODEL=qwen-turbo
```

**获取 API Key**：
1. 访问 https://dashscope.console.aliyun.com/overview
2. 使用阿里云账号登录
3. 在「API Key 管理」中创建新的 API Key
4. 复制 API Key 到 `.env.local` 文件中

**模型选择**：
- `qwen-mini`：最经济（推荐预算有限时使用）
- `qwen-turbo`：推荐使用（性价比高，默认）
- `qwen-plus`：性能更强
- `qwen-max`：最强性能

详细配置请查看 [通义千问配置指南.md](./通义千问配置指南.md)

### 2. 启动开发服务器

```bash
cd app-mvp-estimator
npm run dev
```

### 3. 打开浏览器

访问 http://localhost:3000

### 4. 测试功能

1. 在左侧输入框填写 App 功能描述，例如：
   ```
   想做一个类似小红书的内容分享 App，需要用户登录、发图文、点赞评论、关注、简单数据看板，支持 iOS 和 Android
   ```

2. 选择目标平台（可选）：Web、iOS、Android、小程序

3. 配置其他选项（可选）：
   - 是否需要后台管理
   - 是否包含支付/订阅
   - 是否包含 AI 功能

4. 点击「生成开发评估」按钮

5. 等待几秒钟，右侧会显示 AI 生成的评估报告（Markdown 格式）

## 📝 注意事项

- **必须配置 QWEN_API_KEY**：如果没有配置，系统会显示错误提示
- **API 费用**：每次调用会产生费用，通义千问通常有免费额度，默认使用 `qwen-turbo` 模型（性价比高）
- **网络要求**：国内网络可直接访问，无需代理
- **账户余额**：需要在 DashScope 控制台充值账户余额（通常有免费额度）

## 🔧 修改配置

### 更换通义千问模型

编辑 `.env.local` 文件，修改 `QWEN_MODEL` 参数：

```bash
QWEN_MODEL=qwen-mini  # 可改为 qwen-turbo、qwen-plus、qwen-max
```

### 调整输出长度

编辑 `lib/openai.ts`，修改第 61 行的 `max_tokens` 参数：

```typescript
max_tokens: 2000,  // 根据需要调整
```

### 调整温度参数

编辑 `lib/openai.ts`，修改第 60 行的 `temperature` 参数：

```typescript
temperature: 0.3,  // 0-2，值越低输出越稳定
```

## 📁 项目结构说明

```
app-mvp-estimator/
├── app/
│   ├── api/evaluate/route.ts    # API 路由（POST /api/evaluate）
│   ├── page.tsx                  # 主页面（输入表单 + 结果展示）
│   ├── layout.tsx                # 根布局
│   └── globals.css                # 全局样式
├── components/
│   └── ResultCard.tsx            # Markdown 结果展示组件
├── lib/
│   └── openai.ts                 # OpenAI API 封装 + SYSTEM_PROMPT
├── types.ts                      # TypeScript 类型定义
└── package.json                  # 依赖配置
```

## 🐛 常见问题

### Q: 提示 "OPENAI_API_KEY 未配置"
A: 检查 `.env.local` 文件是否存在，且包含正确的 API Key

### Q: API 调用失败
A: 检查网络连接，确保能访问 OpenAI API（可能需要配置代理）

### Q: 页面样式异常
A: 确保 Tailwind CSS 已正确配置，运行 `npm install` 重新安装依赖

## 📚 更多信息

查看 `README.md` 获取完整的项目文档。


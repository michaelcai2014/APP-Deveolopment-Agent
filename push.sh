#!/bin/bash

# GitHub 代码推送脚本
# 使用方法：在终端执行 ./push.sh

echo "🚀 准备推送代码到 GitHub..."
echo ""

# 检查是否在正确的目录
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是 Git 仓库"
    exit 1
fi

# 检查远程仓库配置
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -z "$REMOTE_URL" ]; then
    echo "❌ 错误：未配置远程仓库"
    exit 1
fi

echo "📦 远程仓库：$REMOTE_URL"
echo ""

# 提示用户输入 GitHub Personal Access Token
echo "请输入你的 GitHub Personal Access Token："
echo "（如果还没有创建，请访问：https://github.com/settings/tokens）"
echo ""
read -s GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误：Token 不能为空"
    exit 1
fi

echo ""
echo "⏳ 正在推送代码..."

# 使用 token 推送
git push https://${GITHUB_TOKEN}@github.com/michaelcai2014/APP-Deveolopment-Agent.git main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo "📂 查看仓库：https://github.com/michaelcai2014/APP-Deveolopment-Agent"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "   1. Token 是否正确"
    echo "   2. Token 是否有 repo 权限"
    echo "   3. 网络连接是否正常"
fi


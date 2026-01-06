# Vercel 部署检查清单

## ✅ 部署前准备

### 1. 代码准备
- [x] Next.js 项目构建成功 (`npm run build`)
- [x] 所有依赖已安装
- [x] TypeScript 编译无错误
- [x] 代码已提交到 Git 仓库

### 2. 环境变量准备

确保你已准备好以下环境变量（在 Vercel 控制台中配置）：

| 变量名 | 说明 | 如何获取 |
|--------|------|----------|
| `AUTH_SECRET` | NextAuth 密钥 | 使用 `openssl rand -base64 32` 生成 |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | Google Cloud Console |
| `GEMINI_API_KEY` | Gemini API 密钥（可选） | Google AI Studio |

### 3. Google OAuth 配置

**开发环境回调 URL**（应该已经配置）：
```
http://localhost:3000/api/auth/callback/google
```

**生产环境回调 URL**（部署后需要添加）：
```
https://your-project.vercel.app/api/auth/callback/google
```

## 🚀 部署步骤

### 方式一：通过 Vercel 网站（推荐）

1. **访问 Vercel**
   - 前往 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的代码仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`
   - Build Command: `npm run build`（自动）
   - Output Directory: `.next`（Next.js 自动处理）

4. **添加环境变量**
   - 在 "Environment Variables" 部分
   - 添加所有必需的环境变量
   - 为所有环境（Production、Preview、Development）添加

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成

6. **配置生产环境 OAuth 回调 URL**
   - 部署完成后，复制生产环境 URL
   - 在 Google Cloud Console 中添加回调 URL

### 方式二：通过 Vercel CLI

```bash
# 1. 安装 CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /Users/junxiong/suredream/aspire-site
vercel

# 4. 添加环境变量
vercel env add AUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GEMINI_API_KEY

# 5. 部署到生产环境
vercel --prod
```

## ✅ 部署后验证

部署完成后，验证以下功能：

- [ ] 访问生产环境 URL，页面正常加载
- [ ] 访问 `/welcome` 页面，登录按钮正常显示
- [ ] 使用 Google 账号登录，可以成功登录
- [ ] 登录后可以访问 `/home` 页面
- [ ] 底部导航正常显示和工作
- [ ] 所有页面路由正常工作

## 📝 注意事项

1. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 生产环境使用不同的 `AUTH_SECRET`
   - 环境变量只在 Vercel 控制台中配置

2. **OAuth 回调 URL**
   - 确保生产环境的回调 URL 已添加到 Google Cloud Console
   - URL 必须完全匹配（包括协议 https）

3. **自动部署**
   - 默认情况下，推送到主分支会自动触发部署
   - 可以在 Vercel 控制台的 Settings 中配置

4. **自定义域名**
   - 部署后可以在 Vercel 控制台配置自定义域名
   - 如果使用自定义域名，需要更新 OAuth 回调 URL

## 🔗 相关文档

详细部署指南请查看：`docs/VERCEL_DEPLOY.md`


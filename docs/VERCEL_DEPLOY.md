# Vercel 部署指南 - Next.js App Router

## 📋 部署前检查清单

- [ ] 代码已提交到 Git 仓库（GitHub、GitLab 或 Bitbucket）
- [ ] 环境变量已准备（不要提交 `.env.local` 到 Git）
- [ ] Next.js 项目可以本地构建成功
- [ ] 已安装 Vercel CLI（可选，用于命令行部署）

## 🚀 部署方式

### 方式一：通过 Vercel 网站（推荐）

这是最简单的方式，适合第一次部署。

#### 步骤 1: 访问 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 如果没有账号，可以免费注册

#### 步骤 2: 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 选择你的代码仓库（如 `aspire-site`）
3. 如果没有看到仓库，点击 **"Adjust GitHub App Permissions"** 授权访问

#### 步骤 3: 配置项目设置

Vercel 应该自动检测到 Next.js 项目，配置如下：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认，如果项目在根目录）
- **Build Command**: `npm run build`（自动）
- **Output Directory**: `.next`（Next.js 自动处理）
- **Install Command**: `npm install`（自动）

**⚠️ 注意**：如果之前是 Vite 项目，确保 Vercel 检测到的是 Next.js，不是 Vite。

#### 步骤 4: 配置环境变量

在 **"Environment Variables"** 部分，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `AUTH_SECRET` | 你的密钥 | 使用 `openssl rand -base64 32` 生成 |
| `GOOGLE_CLIENT_ID` | 你的 Google OAuth 客户端 ID | 从 Google Cloud Console 获取 |
| `GOOGLE_CLIENT_SECRET` | 你的 Google OAuth 客户端密钥 | 从 Google Cloud Console 获取 |
| `GEMINI_API_KEY` | 你的 Gemini API 密钥 | 可选，如果使用 AI 功能 |

**重要提示**：
- 为所有环境添加变量（Production、Preview、Development）
- 每个变量点击 **"Add"** 后再添加下一个
- 不要在生产环境使用开发环境的 `AUTH_SECRET`

#### 步骤 5: 部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常 1-3 分钟）
3. 部署成功后，你会得到一个 URL，如：`https://your-project.vercel.app`

#### 步骤 6: 配置生产环境的 Google OAuth 回调 URL

部署完成后，需要在 Google Cloud Console 中添加生产环境的回调 URL：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 进入 **API 和服務** > **憑證**
3. 找到你的 OAuth 2.0 客户端 ID
4. 在 **授权的重定向 URI** 中添加：
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
5. 如果有自定义域名，也要添加：
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

### 方式二：通过 Vercel CLI

适合需要从命令行部署或需要更多控制的情况。

#### 步骤 1: 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

#### 步骤 3: 部署到预览环境

```bash
cd /Users/junxiong/suredream/aspire-site
vercel
```

按照提示操作：
- 是否要设置和部署项目？**Yes**
- 项目名称：使用默认或自定义
- 目录：`./`
- 是否覆盖设置？**No**（第一次部署）

#### 步骤 4: 设置环境变量

```bash
vercel env add AUTH_SECRET
# 输入你的密钥，然后选择所有环境

vercel env add GOOGLE_CLIENT_ID
# 输入你的 Google 客户端 ID，然后选择所有环境

vercel env add GOOGLE_CLIENT_SECRET
# 输入你的 Google 客户端密钥，然后选择所有环境

vercel env add GEMINI_API_KEY
# 输入你的 Gemini API 密钥，然后选择所有环境（如果使用）
```

#### 步骤 5: 部署到生产环境

```bash
vercel --prod
```

## 🔧 配置说明

### Next.js 配置

项目使用 Next.js 15，配置在 `next.config.js` 中：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 环境变量

所有环境变量都必须在 Vercel 控制台中配置。不要在代码中硬编码密钥。

**必需的环境变量**：
- `AUTH_SECRET` - NextAuth 密钥
- `GOOGLE_CLIENT_ID` - Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth 客户端密钥

**可选的环境变量**：
- `GEMINI_API_KEY` - Gemini API 密钥（如果使用 AI 功能）

### 构建输出

Next.js 会自动处理构建输出，输出到 `.next` 目录。Vercel 会自动识别并部署。

## 🔍 验证部署

部署完成后，检查以下内容：

1. **访问部署的 URL**
   - 应该能看到欢迎页面或自动重定向

2. **测试登录功能**
   - 访问 `/welcome` 页面
   - 点击 "使用 Google 登录"
   - 确保能正常登录

3. **检查环境变量**
   - 在 Vercel 控制台的 **Settings** > **Environment Variables** 中确认所有变量都已配置

4. **查看构建日志**
   - 在 Vercel 控制台的 **Deployments** 标签页
   - 点击最新的部署
   - 查看 **Build Logs** 确认没有错误

## 🐛 常见问题

### 问题 1: 构建失败

**错误信息**: `Module not found` 或类似的构建错误

**解决方案**:
- 检查 `package.json` 中的依赖是否完整
- 确保所有依赖都已安装
- 查看构建日志了解具体错误

### 问题 2: 环境变量未生效

**症状**: 应用运行但功能不正常（如登录失败）

**解决方案**:
- 确认环境变量已在 Vercel 控制台中设置
- 确保为正确的环境（Production/Preview/Development）设置了变量
- 重新部署以应用环境变量更改

### 问题 3: Google OAuth 错误

**错误信息**: `redirect_uri_mismatch`

**解决方案**:
- 在 Google Cloud Console 中添加正确的回调 URL
- 确保 URL 完全匹配（包括协议 https、域名、路径）
- 生产环境 URL: `https://your-project.vercel.app/api/auth/callback/google`

### 问题 4: 图标不显示

**症状**: Material Symbols 图标不显示

**解决方案**:
- 这是客户端字体加载问题，通常不影响功能
- 可以检查 Network 标签页确认字体是否加载
- 如果问题严重，可以考虑使用其他图标库

### 问题 5: 路由问题

**症状**: 404 错误或路由不工作

**解决方案**:
- Next.js App Router 会自动处理路由
- 确保所有页面文件在 `app/` 目录下
- 检查路由路径是否正确

## 📝 后续步骤

部署成功后，你可以：

1. **配置自定义域名**
   - 在 Vercel 控制台的 **Settings** > **Domains** 中添加
   - 按照提示配置 DNS 记录

2. **设置自动部署**
   - 默认情况下，推送到主分支会自动触发部署
   - 在 **Settings** > **Git** 中配置分支和部署设置

3. **监控和日志**
   - 在 Vercel 控制台查看部署历史和日志
   - 使用 **Analytics** 查看访问统计（需要升级到付费计划）

4. **环境管理**
   - Production: 主分支的部署
   - Preview: Pull Request 和分支的部署
   - Development: 开发环境的部署

## 🔐 安全提示

1. **不要提交敏感信息**
   - `.env.local` 应该在 `.gitignore` 中
   - 不要将密钥提交到 Git 仓库

2. **使用不同的密钥**
   - 开发环境和生产环境使用不同的 `AUTH_SECRET`
   - Google OAuth 凭据可以相同，但回调 URL 必须不同

3. **定期轮换密钥**
   - 定期更新 `AUTH_SECRET`
   - 如果密钥泄露，立即更换

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [NextAuth.js 部署指南](https://authjs.dev/getting-started/deployment)


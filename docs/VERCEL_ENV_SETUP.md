# Vercel 环境变量配置指南

## 必需的环境变量

在 Vercel 部署中，您需要在项目设置中配置以下环境变量：

### 1. NextAuth 配置

- **`AUTH_SECRET`** (必需)
  - 用于加密会话和令牌的密钥
  - 生成方式：运行 `openssl rand -base64 32` 或使用在线工具生成
  - 示例：`your-secret-key-here`

- **`GOOGLE_CLIENT_ID`** (必需)
  - Google OAuth 应用的客户端 ID
  - 从 [Google Cloud Console](https://console.cloud.google.com/) 获取
  - 格式：`xxxxx.apps.googleusercontent.com`

- **`GOOGLE_CLIENT_SECRET`** (必需)
  - Google OAuth 应用的客户端密钥
  - 从 Google Cloud Console 获取

### 2. Google OAuth 回调 URL 配置

在 Google Cloud Console 中，确保已配置以下授权重定向 URI：

- 开发环境：`http://localhost:3000/api/auth/callback/google`
- 生产环境：`https://your-domain.vercel.app/api/auth/callback/google`

### 3. 在 Vercel 中配置环境变量

1. 登录 Vercel 控制台
2. 选择您的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. 确保为 **Production**, **Preview**, 和 **Development** 环境都设置了这些变量
6. **重要**：修改环境变量后，需要重新部署项目才能生效

### 4. 验证配置

部署后，检查以下内容：

1. 访问 `/api/auth/providers` 应该返回可用的认证提供者
2. 访问 `/welcome` 页面应该显示登录按钮
3. 点击登录按钮应该跳转到 Google 登录页面
4. 登录成功后应该重定向到 `/home` 页面

### 5. 常见问题

**问题：登录按钮不显示或点击无反应**
- 检查环境变量是否正确配置
- 检查 Google OAuth 回调 URL 是否包含生产域名
- 查看 Vercel 部署日志中的错误信息

**问题：登录后无法访问受保护的路由**
- 检查 `AUTH_SECRET` 是否正确设置
- 检查中间件配置是否正确
- 查看浏览器控制台和服务器日志

**问题：环境变量修改后不生效**
- 确保在 Vercel 中重新部署项目
- 清除浏览器缓存和 cookies
- 检查环境变量是否设置为正确的环境（Production/Preview/Development）

**问题：出现 `error=Configuration` 错误**
- 这表示 NextAuth 配置有问题，通常是缺少必需的环境变量
- 检查以下环境变量是否都已设置：
  - `AUTH_SECRET` - 必需，用于加密会话
  - `GOOGLE_CLIENT_ID` - 必需，Google OAuth 客户端 ID
  - `GOOGLE_CLIENT_SECRET` - 必需，Google OAuth 客户端密钥
- 确保所有环境变量都已添加到 Vercel 项目设置中
- 确保环境变量值没有多余的空格或引号
- 修改环境变量后，必须重新部署项目才能生效
- 检查 Vercel 部署日志，查看是否有环境变量相关的错误信息


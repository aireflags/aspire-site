# NextAuth 集成测试指南

本文档将指导你如何测试 NextAuth.js (Auth.js) 的 Google OAuth 集成。

## 前置要求

1. **Google Cloud Console 项目**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **创建 OAuth 2.0 客户端 ID**
   - 在 Google Cloud Console 中，导航到 "API 和服務" > "憑證"
   - 点击 "建立憑證" > "OAuth 客户端 ID"
   - 应用类型选择 "網頁應用程式"
   - 添加授权的重定向 URI：
     - 开发环境：`http://localhost:3000/api/auth/callback/google`
     - 生产环境：`https://yourdomain.com/api/auth/callback/google`
   - 保存客户端 ID 和客户端密钥

## 配置步骤

### 1. 生成 AUTH_SECRET

运行以下命令生成一个安全的密钥：

```bash
openssl rand -base64 32
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在），并添加以下内容：

```env
AUTH_SECRET=你的生成的密钥
GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥
GEMINI_API_KEY=你的Gemini API密钥（如果已有）
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 测试步骤

### 测试 1: 访问受保护的路由（未登录）

1. 打开浏览器，访问 `http://localhost:3000/home`
2. **预期结果**：应该自动重定向到 `/welcome` 页面

### 测试 2: Welcome 页面显示

1. 访问 `http://localhost:3000/welcome`
2. **预期结果**：
   - 显示 "Welcome to Aspire Homes" 标题
   - 显示 "使用 Google 登录" 按钮
   - 显示提示文字："仅允许 @aspirehomesrealty.com 邮箱登录"

### 测试 3: Google 登录流程（允许的域名）

1. 确保你有一个 `@aspirehomesrealty.com` 的 Google 账号
2. 在 `/welcome` 页面点击 "使用 Google 登录" 按钮
3. **预期结果**：
   - 跳转到 Google 登录页面
   - 选择或输入 `@aspirehomesrealty.com` 账号
   - 授权后重定向回应用
   - 自动跳转到 `/home` 页面

### 测试 4: 域名限制（不允许的域名）

1. 使用非 `@aspirehomesrealty.com` 的 Google 账号尝试登录
2. **预期结果**：
   - 可以完成 Google 授权流程
   - 但在返回应用时，由于域名不匹配，登录会被拒绝
   - 应该保持在登录页面或显示错误

### 测试 5: 访问受保护的路由（已登录）

1. 使用允许的域名登录后
2. 访问以下路由，确认都可以正常访问：
   - `/home`
   - `/aspireAI`
   - `/offerMaker`
   - `/settings`
3. **预期结果**：所有页面都能正常显示，不会重定向到 `/welcome`

### 测试 6: 已登录用户访问 Welcome 页面

1. 在已登录状态下，访问 `/welcome`
2. **预期结果**：应该自动重定向到 `/home` 页面

### 测试 7: 登出功能

1. 在已登录状态下，访问 `/settings` 页面
2. 点击 "Log Out" 按钮
3. **预期结果**：
   - 登出成功
   - 重定向到 `/welcome` 页面
   - 再次访问 `/home` 应该被重定向到 `/welcome`

### 测试 8: Session 持久化

1. 登录后，刷新页面（F5 或 Cmd+R）
2. **预期结果**：Session 应该保持，不需要重新登录

### 测试 9: 回调 URL 处理

1. 未登录状态下，访问 `/aspireAI`
2. 完成登录
3. **预期结果**：登录成功后应该跳转回 `/aspireAI` 页面（而不是 `/home`）

## 故障排除

### 问题 1: "AUTH_SECRET is missing"

**解决方案**：确保 `.env.local` 文件中包含 `AUTH_SECRET`，并且已重启开发服务器。

### 问题 2: Google OAuth 错误 "redirect_uri_mismatch"

**解决方案**：
- 检查 Google Cloud Console 中的授权重定向 URI 是否正确
- 确保 URI 完全匹配（包括协议 http/https、端口号）
- 开发环境使用：`http://localhost:3000/api/auth/callback/google`

### 问题 3: 登录后无法访问页面

**解决方案**：
- 检查浏览器控制台是否有错误
- 确认 middleware.ts 中的路由保护逻辑是否正确
- 检查 NextAuth 配置中的 session 策略是否为 "jwt"

### 问题 4: 域名限制不生效

**解决方案**：
- 检查 `app/api/auth/[...nextauth]/route.ts` 中的 `ALLOWED_EMAIL_DOMAIN` 常量
- 确认 `signIn` callback 中的域名检查逻辑正确
- 查看服务器日志确认 callback 是否被调用

### 问题 5: 页面刷新后丢失 Session

**解决方案**：
- 确认 NextAuth 配置中 `session.strategy` 设置为 `"jwt"`
- 检查 `AUTH_SECRET` 是否正确设置
- 清除浏览器 cookies 后重新登录

## 生产环境部署注意事项

1. **环境变量**：确保在生产环境（如 Vercel）中设置所有必要的环境变量

2. **OAuth 重定向 URI**：在生产环境中，需要在 Google Cloud Console 中添加生产环境的回调 URI：
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. **AUTH_SECRET**：生产环境必须使用强随机密钥，不要使用开发环境的密钥

4. **HTTPS**：OAuth 在生产环境要求使用 HTTPS

## 验证清单

- [ ] 环境变量配置完成
- [ ] Google OAuth 客户端 ID 和密钥已配置
- [ ] AUTH_SECRET 已生成并配置
- [ ] 开发服务器可以正常启动
- [ ] 未登录用户访问受保护路由会被重定向
- [ ] Welcome 页面正常显示
- [ ] 允许的域名可以成功登录
- [ ] 不允许的域名登录被拒绝
- [ ] 登录后可以访问所有受保护的路由
- [ ] 已登录用户访问 welcome 会被重定向
- [ ] 登出功能正常工作
- [ ] Session 持久化正常
- [ ] 回调 URL 处理正确


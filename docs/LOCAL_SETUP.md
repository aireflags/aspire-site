# 本地运行测试指南

## 📋 前置检查清单

在开始之前，请确保您已准备好：

- [ ] Node.js 已安装（推荐 v18+ 或 v20+）
- [ ] Google OAuth 凭据已创建（GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET）
- [ ] 拥有一个 `@aspirehomesrealty.com` 的 Google 账户用于测试登录

## 🚀 快速开始（5 步）

### 步骤 1: 安装依赖

```bash
npm install
```

这将安装所有必要的依赖，包括 Next.js、NextAuth.js、React 等。

### 步骤 2: 生成 AUTH_SECRET

```bash
openssl rand -base64 32
```

复制生成的密钥，稍后会用到。

**提示**：如果您的系统没有 `openssl`，可以使用在线工具生成随机字符串，或使用 Node.js：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤 3: 配置环境变量

创建或编辑 `.env.local` 文件，添加以下内容：

```env
# NextAuth 密钥（从步骤 2 复制的值）
AUTH_SECRET=你刚才生成的密钥

# Google OAuth 凭据（从 Google Cloud Console 获取）
GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥

# Gemini API（可选，如果使用 AI 功能）
GEMINI_API_KEY=你的Gemini API密钥
```

**重要提示**：
- `.env.local` 文件已经在 `.gitignore` 中，不会被提交到代码仓库
- 不要将真实的密钥提交到 Git
- 确保所有值都填写完整，没有多余的引号

### 步骤 4: 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

如果看到类似以下输出，说明启动成功：
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

### 步骤 5: 打开浏览器测试

在浏览器中访问：`http://localhost:3000`

## ✅ 基础测试流程

### 测试 1: 验证路由保护（未登录）

1. 访问 `http://localhost:3000/home`
2. **预期结果**：自动重定向到 `/welcome` 页面

### 测试 2: 查看 Welcome 页面

1. 访问 `http://localhost:3000/welcome`
2. **预期结果**：
   - 显示 "Welcome to Aspire Homes" 标题
   - 显示 "使用 Google 登录" 按钮
   - 显示提示："仅允许 @aspirehomesrealty.com 邮箱登录"

### 测试 3: Google 登录（使用允许的域名）

1. 点击 "使用 Google 登录" 按钮
2. 使用 `@aspirehomesrealty.com` 的 Google 账户登录
3. **预期结果**：
   - 跳转到 Google 登录页面
   - 完成授权后重定向回应用
   - 自动跳转到 `/home` 页面
   - 可以看到首页内容

### 测试 4: 验证域名限制（使用不允许的域名）

1. 登出（在 Settings 页面）
2. 再次尝试登录
3. 使用非 `@aspirehomesrealty.com` 的 Google 账户（如 `@gmail.com`）
4. **预期结果**：
   - 可以完成 Google 授权流程
   - 但登录会被拒绝
   - 保持在 `/welcome` 页面或显示错误

### 测试 5: 验证已登录状态

1. 使用允许的域名登录后
2. 访问以下路由，确认都能正常访问：
   - `/home`
   - `/aspireAI`
   - `/offerMaker`
   - `/settings`
3. **预期结果**：所有页面都能正常显示，不会重定向到 `/welcome`

### 测试 6: 登出功能

1. 在已登录状态下，访问 `/settings`
2. 点击 "Log Out" 按钮
3. **预期结果**：
   - 登出成功
   - 重定向到 `/welcome` 页面
   - 再次访问 `/home` 会被重定向到 `/welcome`

## 🔧 常见问题排查

### 问题 1: `npm install` 失败

**可能原因**：Node.js 版本不兼容

**解决方案**：
```bash
# 检查 Node.js 版本
node --version

# 推荐使用 Node.js 18+ 或 20+
# 如果版本太低，请升级 Node.js
```

### 问题 2: `next: command not found`

**可能原因**：依赖未安装

**解决方案**：
```bash
npm install
```

### 问题 3: 启动后显示端口被占用

**错误信息**：`Port 3000 is already in use`

**解决方案**：
```bash
# 方法 1: 使用其他端口
PORT=3001 npm run dev

# 方法 2: 终止占用端口的进程（macOS/Linux）
lsof -ti:3000 | xargs kill -9

# 方法 3: 终止占用端口的进程（Windows）
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 问题 4: 环境变量未生效

**可能原因**：服务器需要重启

**解决方案**：
1. 停止开发服务器（Ctrl+C）
2. 检查 `.env.local` 文件格式是否正确
3. 确保没有多余的空格或引号
4. 重新启动：`npm run dev`

### 问题 5: Google OAuth 错误 "redirect_uri_mismatch"

**错误信息**：`Error 400: redirect_uri_mismatch`

**解决方案**：
1. 检查 Google Cloud Console 中的授权重定向 URI 设置
2. 确保添加了：`http://localhost:3000/api/auth/callback/google`
3. URI 必须完全匹配（包括协议、端口、路径）
4. 保存后可能需要等待几分钟生效

### 问题 6: 登录后立即被登出

**可能原因**：AUTH_SECRET 未设置或格式错误

**解决方案**：
1. 检查 `.env.local` 文件中的 `AUTH_SECRET`
2. 确保值是有效的 base64 字符串
3. 重新生成并设置新的 `AUTH_SECRET`
4. 重启开发服务器

### 问题 7: 域名限制不生效

**检查步骤**：
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 检查 `auth.ts` 文件中的 `ALLOWED_EMAIL_DOMAIN` 常量
4. 确认用户邮箱确实以 `@aspirehomesrealty.com` 结尾

## 📝 验证清单

在开始测试前，确认以下项目：

- [ ] 依赖已安装（`node_modules` 目录存在）
- [ ] `.env.local` 文件已创建并包含所有必要的环境变量
- [ ] `AUTH_SECRET` 已生成并配置
- [ ] `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 已配置
- [ ] Google Cloud Console 中已配置正确的重定向 URI
- [ ] 开发服务器可以正常启动
- [ ] 浏览器可以访问 `http://localhost:3000`

## 🎯 下一步

完成基础测试后，您可以：

1. 查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 了解更详细的测试步骤
2. 查看 [README_NEXTAUTH.md](./README_NEXTAUTH.md) 了解完整的集成说明
3. 开始开发和自定义功能

## 💡 提示

- 开发服务器支持热重载，修改代码后会自动刷新
- 使用浏览器开发者工具（F12）查看控制台错误和网络请求
- 如果遇到问题，检查终端输出的错误信息
- 确保 Google OAuth 凭据的授权重定向 URI 配置正确


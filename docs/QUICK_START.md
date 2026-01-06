# 🚀 快速开始 - 本地运行测试

## 当前环境状态

✅ Node.js: v22.21.1（已安装）  
✅ npm: v10.9.4（已安装）  
✅ node_modules: 已存在  
⚠️ Next.js: 需要确认是否已安装  
⚠️ .env.local: 已存在（需要检查配置）

## 立即开始（3 步）

### 步骤 1: 安装/更新依赖

```bash
npm install
```

这将安装所有必要的依赖包。

### 步骤 2: 配置环境变量

检查 `.env.local` 文件是否包含以下变量：

```env
AUTH_SECRET=你的密钥（使用 openssl rand -base64 32 生成）
GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥
GEMINI_API_KEY=你的Gemini API密钥（可选）
```

如果还没有配置，请：

1. **生成 AUTH_SECRET**：
   ```bash
   openssl rand -base64 32
   ```
   复制生成的密钥

2. **获取 Google OAuth 凭据**：
   - 访问 https://console.cloud.google.com/
   - 创建 OAuth 2.0 客户端 ID
   - 添加重定向 URI：`http://localhost:3000/api/auth/callback/google`

3. **编辑 `.env.local`**，填入上述值

### 步骤 3: 启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问：**http://localhost:3000**

## 🧪 快速测试

1. **测试路由保护**：
   - 访问 `http://localhost:3000/home`
   - 应该自动重定向到 `/welcome`

2. **测试登录**：
   - 在 `/welcome` 页面点击 "使用 Google 登录"
   - 使用 `@aspirehomesrealty.com` 账户登录
   - 应该成功登录并跳转到 `/home`

3. **测试域名限制**：
   - 登出后，使用非 `@aspirehomesrealty.com` 账户尝试登录
   - 应该被拒绝

## 📚 详细文档

- **完整设置指南**：查看 [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- **详细测试步骤**：查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **集成说明**：查看 [README_NEXTAUTH.md](./README_NEXTAUTH.md)

## ❓ 遇到问题？

查看 [LOCAL_SETUP.md](./LOCAL_SETUP.md) 中的"常见问题排查"部分。


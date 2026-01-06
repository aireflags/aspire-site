# Vercel 环境变量快速配置指南

## 🚨 当前问题

您看到了 `error=Configuration` 错误，这表示缺少必需的环境变量。请按照以下步骤配置。

## 📋 步骤 1: 生成 AUTH_SECRET

### 方法 1: 使用命令行（推荐）

在终端运行：
```bash
openssl rand -base64 32
```

复制生成的字符串（例如：`xK8mN2pQ5rT7vW9yZ1aB3cD4eF6gH8jK0lM2nO4pQ6rS8tU0vW2xY4zA6bC8dE0`）

### 方法 2: 使用在线工具

访问：https://generate-secret.vercel.app/32
或使用任何在线随机字符串生成器，生成至少 32 个字符的随机字符串。

## 📋 步骤 2: 获取 Google OAuth 凭证

### 2.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击项目选择器，创建新项目或选择现有项目
3. 等待项目创建完成

### 2.2 启用 Google+ API

1. 在左侧菜单选择 **APIs & Services** → **Library**
2. 搜索 "Google+ API" 或 "Google Identity"
3. 点击 **Enable** 启用 API

### 2.3 创建 OAuth 2.0 凭证

1. 进入 **APIs & Services** → **Credentials**
2. 点击 **+ CREATE CREDENTIALS** → **OAuth client ID**
3. 如果提示配置 OAuth 同意屏幕：
   - 选择 **External**（除非您有 Google Workspace）
   - 填写应用名称（例如：Aspire Homes）
   - 填写用户支持邮箱
   - 添加您的邮箱到测试用户列表（如果需要）
   - 保存并继续
4. 创建 OAuth 客户端：
   - **Application type**: Web application
   - **Name**: Aspire Homes（或您喜欢的名称）
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`（开发环境）
     - `https://aspire-site-git-vibe-suredreams-projects.vercel.app`（生产环境）
     - `https://your-production-domain.vercel.app`（如果有自定义域名）
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`（开发环境）
     - `https://aspire-site-git-vibe-suredreams-projects.vercel.app/api/auth/callback/google`（生产环境）
     - `https://your-production-domain.vercel.app/api/auth/callback/google`（如果有自定义域名）
5. 点击 **Create**
6. **重要**：复制显示的 **Client ID** 和 **Client secret**（Client secret 只显示一次！）

## 📋 步骤 3: 在 Vercel 中添加环境变量

### 3.1 进入 Vercel 项目设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到并点击您的项目 `aspire-site`
3. 点击顶部菜单的 **Settings**
4. 在左侧菜单选择 **Environment Variables**

### 3.2 添加环境变量

为每个变量执行以下操作：

#### 添加 AUTH_SECRET

1. 在 **Key** 输入框输入：`AUTH_SECRET`
2. 在 **Value** 输入框粘贴您生成的密钥（步骤 1）
3. 选择环境：**Production**, **Preview**, **Development**（全部勾选）
4. 点击 **Save**

#### 添加 GOOGLE_CLIENT_ID

1. 在 **Key** 输入框输入：`GOOGLE_CLIENT_ID`
2. 在 **Value** 输入框粘贴您的 Google Client ID（步骤 2.3）
3. 选择环境：**Production**, **Preview**, **Development**（全部勾选）
4. 点击 **Save**

#### 添加 GOOGLE_CLIENT_SECRET

1. 在 **Key** 输入框输入：`GOOGLE_CLIENT_SECRET`
2. 在 **Value** 输入框粘贴您的 Google Client Secret（步骤 2.3）
3. 选择环境：**Production**, **Preview**, **Development**（全部勾选）
4. 点击 **Save**

### 3.3 验证环境变量

添加完成后，您应该看到三个环境变量：
- ✅ `AUTH_SECRET`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`

## 📋 步骤 4: 重新部署项目

**重要**：添加环境变量后，必须重新部署项目才能生效。

### 方法 1: 通过 Git 推送触发部署

```bash
# 创建一个空提交来触发部署
git commit --allow-empty -m "Trigger deployment for environment variables"
git push
```

### 方法 2: 在 Vercel Dashboard 手动部署

1. 在 Vercel 项目页面
2. 点击 **Deployments** 标签
3. 找到最新的部署，点击右侧的 **...** 菜单
4. 选择 **Redeploy**
5. 确认重新部署

## 📋 步骤 5: 验证配置

部署完成后：

1. 访问您的应用：`https://aspire-site-git-vibe-suredreams-projects.vercel.app/welcome`
2. 错误提示应该消失
3. 点击 "使用 Google 登录" 按钮
4. 应该跳转到 Google 登录页面
5. 登录成功后应该重定向到 `/home` 页面

## 🔍 故障排除

### 问题：环境变量添加后仍然显示错误

**解决方案**：
- 确保已重新部署项目
- 检查环境变量名称是否正确（区分大小写）
- 检查环境变量值是否有多余的空格
- 查看 Vercel 部署日志中的错误信息

### 问题：Google 登录后显示 "Access Denied"

**解决方案**：
- 检查 Google OAuth 回调 URL 是否正确配置
- 确保回调 URL 包含完整的域名和路径
- 检查您的邮箱域名是否在允许列表中（`aspirehomesrealty.com`, `gmail.com`, `ratednagroup.com`）

### 问题：无法找到环境变量设置

**解决方案**：
- 确保您有项目的管理员权限
- 在 Vercel Dashboard 中，项目 → Settings → Environment Variables

## 📝 检查清单

完成配置前，请确认：

- [ ] 已生成 `AUTH_SECRET`（32+ 字符的随机字符串）
- [ ] 已在 Google Cloud Console 创建 OAuth 客户端
- [ ] 已配置 Google OAuth 回调 URL（包含生产域名）
- [ ] 已在 Vercel 添加 `AUTH_SECRET` 环境变量
- [ ] 已在 Vercel 添加 `GOOGLE_CLIENT_ID` 环境变量
- [ ] 已在 Vercel 添加 `GOOGLE_CLIENT_SECRET` 环境变量
- [ ] 已为所有环境（Production/Preview/Development）设置变量
- [ ] 已重新部署项目
- [ ] 已测试登录功能

## 🆘 需要帮助？

如果按照以上步骤操作后仍有问题：

1. 检查 Vercel 部署日志：项目 → Deployments → 点击最新部署 → 查看日志
2. 检查浏览器控制台：F12 → Console 标签，查看是否有错误
3. 验证 API 路由：访问 `https://your-domain.vercel.app/api/auth/providers`，应该返回 JSON 数据


# 部署到 Vercel

本项目已配置好 Vercel 部署。有两种部署方式：

## 方式一：通过 Vercel 网站（推荐）

1. **访问 Vercel**
   - 前往 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库：`suredream/aspire-site`
   - 点击 "Import"

3. **配置项目设置**
   - Framework Preset: Vite（应该自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `npm run build`（默认）
   - Output Directory: `dist`（默认）

4. **配置环境变量**
   - 在 "Environment Variables" 部分
   - 添加环境变量：
     - Name: `GEMINI_API_KEY`
     - Value: 你的 Gemini API Key
   - 选择所有环境（Production, Preview, Development）
   - 点击 "Add"

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成
   - 部署完成后，你会获得一个 URL（如 `https://your-project.vercel.app`）

## 方式二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd /Users/junxiong/suredream/aspire-site
   vercel
   ```

4. **设置环境变量**
   ```bash
   vercel env add GEMINI_API_KEY
   # 输入你的 API Key，然后选择所有环境
   ```

5. **部署到生产环境**
   ```bash
   vercel --prod
   ```

## 重要提示

- ⚠️ **环境变量**：确保在 Vercel 项目设置中配置了 `GEMINI_API_KEY` 环境变量
- 🔄 **自动部署**：如果你通过 GitHub 集成部署，每次推送到 main 分支都会自动触发部署
- 🌐 **域名**：部署后可以在 Vercel 项目中配置自定义域名

## 验证部署

部署成功后，访问提供的 URL，检查：
- ✅ 页面正常加载
- ✅ 导航功能正常
- ✅ aspireAI 聊天功能可以使用（需要正确的 API Key）


# 迁移到 Next.js 的说明

## 重要变更

项目已从 **React + Vite** 迁移到 **Next.js 15 (App Router)**，并集成了 **NextAuth.js v5 (Auth.js)**。

## 路由变更说明

### Hash 路由 vs 标准路由

**原要求**：使用 `/#/welcome` 和 `/#/home` (hash 路由)

**实际实现**：使用 `/welcome` 和 `/home` (标准路由)

**原因**：Next.js App Router 使用基于文件系统的标准路由，不支持 hash 路由（`#`）。这是 Next.js 的核心特性，无法在不破坏框架架构的情况下实现 hash 路由。

**影响**：
- URL 从 `http://localhost:3000/#/home` 变为 `http://localhost:3000/home`
- 功能完全相同，只是 URL 格式不同
- 更适合 SEO 和服务器端渲染

如果您确实需要 hash 路由，可以考虑：
1. 使用客户端路由库（但会失去 Next.js 的许多优势）
2. 保持在 React + Vite 架构（但无法使用 Next.js 的 middleware 和 App Router）

## 文件结构变更

### 新增文件
- `auth.ts` - NextAuth 配置
- `middleware.ts` - 路由保护中间件
- `next.config.js` - Next.js 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置
- `app/` - Next.js App Router 目录
  - `app/layout.tsx` - 根布局
  - `app/globals.css` - 全局样式
  - `app/page.tsx` - 首页（重定向到 /home）
  - `app/welcome/page.tsx` - 登录页面
  - `app/(protected)/` - 受保护的路由组
    - `app/(protected)/layout.tsx` - 受保护路由的布局（包含底部导航）
    - `app/(protected)/home/page.tsx` - 首页
    - `app/(protected)/aspireAI/page.tsx` - AI 助手页面
    - `app/(protected)/offerMaker/page.tsx` - Offer Maker 页面
    - `app/(protected)/settings/page.tsx` - 设置页面
  - `app/api/auth/[...nextauth]/route.ts` - NextAuth API 路由
  - `app/components/BottomNav.tsx` - 底部导航组件
  - `app/providers.tsx` - Session Provider

### 保留的旧文件（未使用）
以下文件已迁移到 `app/` 目录，旧文件保留作为参考：
- `pages/` - 旧的页面文件（已迁移到 `app/(protected)/`）
- `App.tsx` - 旧的主应用组件（已迁移到 `app/` 布局）
- `index.tsx` - 旧的入口文件（Next.js 自动处理）
- `vite.config.ts` - Vite 配置（不再需要）

## 环境变量

需要配置以下环境变量（在 `.env.local` 文件中）：

```env
AUTH_SECRET=你的密钥（使用 openssl rand -base64 32 生成）
GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥
GEMINI_API_KEY=你的Gemini API密钥（如果使用）
```

## 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 主要功能

✅ NextAuth.js v5 (Auth.js) 集成
✅ Google OAuth Provider
✅ 域名限制（仅允许 @aspirehomesrealty.com）
✅ JWT Session（无需数据库）
✅ Middleware 路由保护
✅ Welcome 登录页面
✅ 自动重定向逻辑
✅ 登出功能

## 下一步

1. 配置 Google OAuth 凭据（见 TESTING_GUIDE.md）
2. 设置环境变量
3. 测试登录流程
4. 部署到生产环境（Vercel 或其他 Next.js 兼容平台）


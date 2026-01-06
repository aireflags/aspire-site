# 技术方案、架构决策、接口定义

## 1. 技术栈

### 1.1 核心框架
- **React**: 19.2.3
  - **选择理由**：最新稳定版本，提供现代化 Hooks API 和性能优化
  - **用途**：UI 组件构建和状态管理

- **TypeScript**: 5.8.2
  - **选择理由**：提供类型安全，提高代码可维护性和开发体验
  - **用途**：类型定义和编译时类型检查

### 1.2 构建工具
- **Vite**: 6.2.0
  - **选择理由**：快速的开发服务器和构建工具，支持现代 JavaScript
  - **配置**：使用 `@vitejs/plugin-react` 插件支持 React

### 1.3 路由
- **React Router DOM**: 7.11.0
  - **路由模式**：HashRouter
  - **选择理由**：适合静态部署（Vercel），无需服务器配置
  - **路由配置**：
    - `/` → 重定向到 `/home`
    - `/home` → Home 页面
    - `/aspireAI` → AspireAI 页面
    - `/settings` → Settings 页面

### 1.4 样式方案
- **Tailwind CSS**: 通过 CDN 引入
  - **选择理由**：快速开发，实用优先的 CSS 框架
  - **配置**：自定义主题颜色和字体
  - **图标**：Material Symbols Outlined（通过 Google Fonts CDN）

### 1.5 AI 服务
- **Google Gemini AI**: `@google/genai` 1.34.0
  - **模型**：`gemini-3-flash-preview`
  - **选择理由**：Google 的先进 AI 模型，API 易用
  - **集成方式**：通过服务层封装（`services/gemini.ts`）

### 1.6 部署平台
- **Vercel**: 静态部署
  - **选择理由**：快速部署，自动 CI/CD，适合 React SPA
  - **配置**：通过 `vercel.json` 配置构建和部署参数

## 2. 架构设计

### 2.1 项目结构

```
aspire-site/
├── pages/              # 页面组件
│   ├── Home.tsx
│   ├── aspireAI.tsx
│   ├── Portfolio.tsx   # 未使用的页面
│   └── Settings.tsx
├── components/         # 可复用组件
│   ├── BottomNav.tsx
│   ├── CopilotBar.tsx  # 未使用的组件
│   └── ToolCard.tsx
├── services/           # 业务逻辑和服务
│   └── gemini.ts       # Gemini API 封装
├── types.ts            # TypeScript 类型定义
├── constants.tsx       # 常量配置
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口
├── vite.config.ts      # Vite 配置
├── vercel.json         # Vercel 部署配置
└── index.html          # HTML 模板
```

### 2.2 架构模式

#### 组件分层
1. **页面层（Pages）**：
   - 负责路由和页面级布局
   - 组合多个组件
   - 管理页面级状态

2. **组件层（Components）**：
   - 可复用的 UI 组件
   - 接收 Props，无业务逻辑
   - 可包含内部状态（UI 相关）

3. **服务层（Services）**：
   - 封装外部 API 调用
   - 处理业务逻辑
   - 提供可复用的函数

4. **配置层（Constants/Types）**：
   - 类型定义
   - 常量配置
   - 数据结构定义

### 2.3 状态管理策略

#### 当前方案：本地状态（Local State）
- **使用 Hooks**：`useState`, `useEffect`, `useRef`
- **适用场景**：
  - 组件内部 UI 状态
  - 表单输入
  - 异步操作状态

#### 状态分布
- **AspireAI 页面**：
  - `input`: 输入框内容
  - `isProcessing`: API 调用状态
  - `messages`: 对话历史
  - `isOpen`: CopilotBar 展开状态（未使用）

- **其他页面**：当前无状态管理需求

#### 未来扩展考虑
- 如果状态共享需求增加，可考虑：
  - Context API（简单共享）
  - 状态管理库（Redux、Zustand 等，复杂场景）

### 2.4 路由架构

#### 路由配置
```typescript
<HashRouter>
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/aspireAI" element={<AspireAI />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/" element={<Navigate to="/home" replace />} />
  </Routes>
</HashRouter>
```

#### 导航组件
- **BottomNav**：固定底部导航
- **NavLink**：带激活状态的导航链接
- **路由守卫**：当前无路由守卫（无认证需求）

### 2.5 样式架构

#### Tailwind CSS 配置
- **自定义主题**：在 `index.html` 中通过 JavaScript 配置
- **颜色系统**：
  ```javascript
  primary: '#137fec'
  background-dark: '#0a0f14'
  card-dark: '#1c2127'
  ```

#### 样式组织
- **工具类优先**：使用 Tailwind 工具类
- **自定义样式**：通过 `<style>` 标签添加（滚动条、字体等）
- **响应式**：移动端优先，使用 `max-w-md` 限制宽度

### 2.6 构建与部署架构

#### 开发环境
```bash
npm run dev  # 启动 Vite 开发服务器（端口 3000）
```

#### 构建流程
```bash
npm run build  # Vite 构建到 dist/ 目录
```

#### 部署流程
1. 代码推送到 Git 仓库
2. Vercel 自动检测并构建
3. 部署到生产环境
4. 环境变量在 Vercel 控制台配置

## 3. 核心模块设计

### 3.1 Gemini API 服务模块

#### 文件：`services/gemini.ts`

#### 职责
- 封装 Gemini API 调用
- 处理错误和异常
- 提供统一的接口

#### 接口定义
```typescript
generateCopilotResponse(userPrompt: string): Promise<string>
```

#### 实现细节
- **API Key**：从环境变量 `GEMINI_API_KEY` 读取
- **模型**：`gemini-3-flash-preview`
- **系统指令**：定义 AI 角色为金融经纪人助手
- **温度参数**：0.7（平衡创造性和准确性）
- **错误处理**：捕获异常并返回友好错误消息

#### 依赖
- `@google/genai`: Google Gemini AI SDK

### 3.2 类型定义模块

#### 文件：`types.ts`

#### 类型定义
```typescript
interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
```

#### 用途
- 提供类型安全
- 作为组件 Props 的类型定义
- 确保数据结构一致性

### 3.3 常量配置模块

#### 文件：`constants.tsx`

#### 内容
- **ENTERPRISE_TOOLS**：10 个企业工具的配置数组
- 每个工具包含：id、标题、副标题、图标、颜色配置

#### 用途
- 集中管理工具配置
- 便于维护和扩展
- 类型安全（使用 `ToolItem[]`）

### 3.4 组件设计

#### ToolCard 组件
- **职责**：展示单个工具卡片
- **Props**：`tool: ToolItem`
- **交互**：Hover 效果、Active 效果
- **状态**：无内部状态

#### BottomNav 组件
- **职责**：底部导航栏
- **Props**：无
- **交互**：路由导航、激活状态高亮
- **状态**：无内部状态（使用 NavLink 的 isActive）

#### CopilotBar 组件（未使用）
- **职责**：AI 助手输入栏和迷你聊天窗口
- **状态**：输入、消息列表、展开状态
- **功能**：类似 AspireAI 页面，但以浮动窗口形式

### 3.5 页面组件设计

#### Home 页面
- **布局**：Header + 工具卡片网格
- **状态**：无状态
- **数据源**：`ENTERPRISE_TOOLS` 常量

#### AspireAI 页面
- **布局**：Header + 聊天区域 + 输入栏
- **状态**：
  - `input`: 输入内容
  - `isProcessing`: API 调用状态
  - `messages`: 对话历史
- **功能**：
  - 显示常见问题
  - 发送消息到 AI
  - 显示 AI 响应
  - 自动滚动

#### Settings 页面
- **布局**：标题 + 设置选项列表 + 登出按钮
- **状态**：无状态
- **数据源**：硬编码的设置选项数组

## 4. 接口定义

### 4.1 Gemini API 接口

#### 请求接口
```typescript
// 服务层封装
generateCopilotResponse(userPrompt: string): Promise<string>

// 底层 API 调用（@google/genai）
ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: userPrompt,
  config: {
    systemInstruction: string,
    temperature: number
  }
})
```

#### 响应接口
```typescript
// 成功响应
{
  text: string  // AI 生成的文本响应
}

// 错误处理
// 返回错误消息字符串，不抛出异常
```

### 4.2 组件接口

#### ToolCard Props
```typescript
interface ToolCardProps {
  tool: ToolItem;
}
```

#### BottomNav Props
```typescript
// 无 Props，使用路由上下文
```

#### CopilotBar Props（未使用）
```typescript
// 无 Props，完全自包含
```

### 4.3 数据类型接口

#### ToolItem
```typescript
interface ToolItem {
  id: string;           // 唯一标识符
  title: string;        // 工具标题
  subtitle: string;     // 工具副标题/描述
  icon: string;         // Material Symbols 图标名称
  colorClass: string;   // Tailwind 文本颜色类
  bgClass: string;      // Tailwind 背景颜色类
}
```

#### ChatMessage
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';  // 消息角色
  content: string;              // 消息内容
}
```

## 5. 环境变量与配置

### 5.1 环境变量

#### 必需变量
- **GEMINI_API_KEY**: Google Gemini API 密钥
  - **用途**：Gemini API 认证
  - **获取方式**：Google AI Studio
  - **配置位置**：
    - 开发：`.env.local`
    - 生产：Vercel 环境变量设置

### 5.2 Vite 配置

#### 环境变量处理
```typescript
// vite.config.ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

#### 开发服务器配置
```typescript
server: {
  port: 3000,
  host: '0.0.0.0'  // 允许外部访问
}
```

#### 路径别名
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, '.')
  }
}
```

### 5.3 Vercel 部署配置

#### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 6. 架构决策记录（ADR）

### 6.1 ADR-001: 使用 HashRouter 而非 BrowserRouter

**决策**：使用 HashRouter 进行路由管理

**理由**：
- 适合静态部署（Vercel）
- 无需服务器配置 URL 重写
- 简化部署流程

**后果**：
- URL 包含 `#` 符号（如 `#/home`）
- 可能影响 SEO（但此应用为内部工具，影响不大）

### 6.2 ADR-002: 使用 Tailwind CSS CDN 而非 npm 包

**决策**：通过 CDN 引入 Tailwind CSS

**理由**：
- 快速启动，无需配置
- 减少构建复杂度

**后果**：
- 依赖外部 CDN，需要网络连接
- 无法进行 PurgeCSS 优化，包含未使用的样式
- 生产环境建议迁移到 npm 包并配置构建优化

### 6.3 ADR-003: 本地状态管理而非全局状态管理

**决策**：使用 React Hooks 进行本地状态管理

**理由**：
- 当前应用状态共享需求少
- 简化架构，避免过度设计
- 符合 React 最佳实践

**后果**：
- 如果未来需要跨组件状态共享，需要重构
- 灵活性高，易于扩展

### 6.4 ADR-004: 函数式组件 + Hooks 而非类组件

**决策**：全面使用函数式组件和 Hooks

**理由**：
- React 官方推荐
- 代码更简洁
- 更好的性能优化支持
- 更好的 TypeScript 支持

**后果**：
- 需要熟悉 Hooks API
- 某些旧版教程可能不适用

### 6.5 ADR-005: TypeScript 严格模式

**决策**：使用 TypeScript 并提供完整类型定义

**理由**：
- 类型安全，减少运行时错误
- 更好的 IDE 支持
- 代码自文档化

**后果**：
- 需要编写类型定义
- 开发初期可能增加工作量
- 长期维护收益高

### 6.6 ADR-006: 静态数据配置而非动态 API

**决策**：工具列表等数据使用静态配置（constants.tsx）

**理由**：
- 当前无后端服务
- 简化架构
- 快速开发

**后果**：
- 修改配置需要重新构建
- 未来如需动态配置需要重构

## 7. 性能考虑

### 7.1 当前性能优化

#### 代码层面
- 使用 React 19 的性能优化特性
- 函数式组件减少不必要的重渲染
- 合理的 `useEffect` 依赖数组

#### 构建层面
- Vite 的快速构建和 HMR
- 生产构建自动代码压缩和优化

### 7.2 潜在性能问题

#### CDN 依赖
- Tailwind CSS、Material Symbols、React 等通过 CDN
- 首次加载可能较慢
- **建议**：迁移到 npm 包，使用构建优化

#### 消息列表性能
- 大量消息时可能影响渲染性能
- **建议**：实现虚拟滚动或消息分页

#### 图片资源
- 用户头像使用外部 URL（picsum.photos）
- **建议**：使用本地资源或 CDN

### 7.3 优化建议

1. **代码分割**：按路由分割代码，实现懒加载
2. **图片优化**：使用 WebP 格式，实现懒加载
3. **缓存策略**：配置静态资源缓存
4. **打包优化**：分析打包体积，移除未使用代码

## 8. 安全考虑

### 8.1 API Key 安全

#### 当前实现
- API Key 通过环境变量管理
- 在 `vite.config.ts` 中注入到构建产物

#### 风险
- API Key 会包含在客户端代码中（前端无法完全隐藏）
- **缓解措施**：
  - 使用 API 网关或后端代理
  - 配置 Gemini API 的域名限制
  - 使用速率限制

### 8.2 输入验证

#### 当前实现
- 基本的前端验证（空输入检查）

#### 建议
- 添加输入长度限制
- 过滤恶意输入
- 在后端进行二次验证（如有后端）

### 8.3 XSS 防护

#### React 默认保护
- React 自动转义用户输入，防止 XSS

#### 注意事项
- 如果未来使用 `dangerouslySetInnerHTML`，需要额外验证

## 9. 扩展性设计

### 9.1 添加新页面
1. 在 `pages/` 目录创建新组件
2. 在 `App.tsx` 中添加路由
3. 在 `BottomNav` 中添加导航项（如需要）

### 9.2 添加新工具
1. 在 `constants.tsx` 的 `ENTERPRISE_TOOLS` 数组中添加配置
2. 在 `ToolCard` 组件中处理点击事件（如需要）

### 9.3 集成新的 AI 模型
1. 在 `services/` 目录创建新的服务文件
2. 封装 API 调用逻辑
3. 在组件中使用新服务

### 9.4 添加状态管理
- 如需要全局状态，可引入 Context API 或状态管理库
- 保持当前架构的渐进式扩展原则

## 10. 测试策略（未来）

### 10.1 单元测试
- 测试服务层函数（`generateCopilotResponse`）
- 测试工具函数和工具类

### 10.2 组件测试
- 测试组件渲染
- 测试用户交互
- 测试 Props 传递

### 10.3 集成测试
- 测试路由导航
- 测试 API 集成
- 测试完整的用户流程

### 10.4 E2E 测试
- 使用 Playwright 或 Cypress
- 测试关键用户场景


# AI Coder 工作约定

本文档定义了 AI 辅助开发时的工作规范与约定，确保代码质量和开发效率。

## 1. 代码风格与规范

### TypeScript/React 规范
- **组件定义**：使用函数式组件 + TypeScript 接口定义 Props
- **命名约定**：
  - 组件文件：PascalCase（如 `ToolCard.tsx`）
  - 函数/变量：camelCase
  - 常量：UPPER_SNAKE_CASE（如 `ENTERPRISE_TOOLS`）
  - 类型接口：PascalCase（如 `ToolItem`, `ChatMessage`）
- **文件组织**：
  - 页面组件：`pages/` 目录
  - 可复用组件：`components/` 目录
  - 业务逻辑/服务：`services/` 目录
  - 类型定义：`types.ts`
  - 常量配置：`constants.tsx`

### 代码结构
```typescript
// 导入顺序：React -> 第三方库 -> 本地模块
import React from 'react';
import { NavLink } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
```

## 2. 样式规范

### Tailwind CSS 使用约定
- **颜色系统**：使用预定义的颜色变量
  - `primary`: `#137fec`（主色调）
  - `background-dark`: `#0a0f14`
  - `card-dark`: `#1c2127`
  - 文本颜色：`text-white`, `text-[#9dabb9]`（次要文本）
  - 边框颜色：`border-[#3b4754]`

- **响应式设计**：
  - 容器最大宽度：`max-w-md`（移动端优先）
  - 使用 `mx-auto` 居中
  - 间距系统：`p-4`, `gap-3`, `mb-6` 等

- **状态样式**：
  - Hover: `hover:bg-[#283039]`
  - Active: `active:scale-95`
  - Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
  - Transition: `transition-colors`, `transition-all duration-200`

### Material Symbols 图标
- 使用 Material Symbols Outlined 图标库
- 图标类名：`material-symbols-outlined`
- 尺寸：`text-[24px]`, `text-2xl`, `text-sm`

## 3. 组件开发规范

### 组件职责
- **页面组件**：负责路由和页面级布局
- **展示组件**：纯展示逻辑，通过 Props 接收数据
- **容器组件**：处理状态管理和业务逻辑

### Props 类型定义
```typescript
interface ComponentProps {
  // 必需属性在前
  id: string;
  title: string;
  // 可选属性在后
  onClick?: () => void;
}
```

### 状态管理
- 使用 React Hooks（`useState`, `useEffect`, `useRef`）
- 本地状态优先，避免过早抽象
- 异步操作使用 `async/await`，配合错误处理

## 4. 路由与导航

### 路由配置
- 使用 `HashRouter`（适合静态部署）
- 路由路径：`/home`, `/aspireAI`, `/settings`
- 默认重定向：`/` → `/home`

### 导航组件
- 底部导航固定：`BottomNav`
- 使用 `NavLink` 进行导航，支持 `isActive` 状态
- 导航项激活状态：`text-primary`，未激活：`text-[#9dabb9]`

## 5. API 与外部服务

### Gemini API 集成
- 环境变量：`GEMINI_API_KEY`
- 服务层封装：`services/gemini.ts`
- 错误处理：返回用户友好的错误消息
- API 调用使用 `async/await`，避免阻塞 UI

### 错误处理模式
```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error("API Error:", error);
  return "友好的错误提示";
}
```

## 6. 环境与配置

### 环境变量
- 开发环境：`.env.local`
- 生产环境：Vercel 环境变量配置
- 在 `vite.config.ts` 中通过 `loadEnv` 加载
- 使用 `define` 注入到构建产物

### 构建配置
- 构建工具：Vite 6.2.0
- 开发服务器：端口 3000，host `0.0.0.0`
- 输出目录：`dist/`

## 7. 代码质量

### 最佳实践
- **可访问性**：确保按钮有合适的 aria-label，表单元素有 label
- **性能**：使用 `useRef` 避免不必要的重渲染，合理使用 `useEffect` 依赖
- **可维护性**：单一职责原则，组件保持小而专注
- **类型安全**：充分利用 TypeScript 类型系统，避免 `any`

### 注释规范
- 复杂逻辑需要注释说明
- 组件 Props 接口通过 TypeScript 类型文档化
- 关键业务逻辑添加行内注释

## 8. 重构原则

### 何时重构
- 发现重复代码（DRY 原则）
- 组件职责不清晰
- 性能问题需要优化
- 代码可读性差

### 重构注意事项
- **渐进式重构**：不要一次性大规模重构
- **保持功能不变**：重构前确保有测试或手动验证
- **向后兼容**：考虑现有代码的依赖关系
- **文档更新**：重构后更新相关文档

## 9. Git 提交规范

### 提交信息格式
```
<type>: <subject>

<body>
```

### Type 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 重构
- `style`: 代码格式调整
- `docs`: 文档更新
- `chore`: 构建/工具链相关

## 10. AI 辅助开发提示

### 对 AI 的指令要求
- **明确需求**：清晰描述要实现的功能和期望行为
- **提供上下文**：说明相关的现有代码和架构
- **指定技术栈**：明确使用的框架和库版本
- **代码审查**：AI 生成的代码需要人工审查后再合并

### AI 生成代码检查清单
- [ ] 是否符合项目代码风格
- [ ] TypeScript 类型是否完整
- [ ] 是否有错误处理
- [ ] 是否符合响应式设计
- [ ] 是否有性能问题
- [ ] 是否符合可访问性标准


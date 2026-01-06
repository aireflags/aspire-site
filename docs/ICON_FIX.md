# Material Symbols 图标显示问题修复指南

## 问题
Home 页面的图标和底部按钮图标无法显示

## 已完成的修复

### 1. CSS 配置 (`app/globals.css`)
- ✅ 添加了 Material Symbols 字体的 @import
- ✅ 配置了 `.material-symbols-outlined` 类的完整样式
- ✅ 设置了正确的 font-variation-settings

### 2. Layout 配置 (`app/layout.tsx`)
- ⚠️ 尝试在 `<head>` 中添加字体链接（Next.js App Router 可能不支持）

## 当前状态

Material Symbols 字体应该通过 CSS @import 加载。如果图标仍然不显示，请尝试以下步骤：

## 调试步骤

### 1. 检查浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 转到 **Network** 标签页
3. 刷新页面
4. 搜索 "Material" 或 "font"
5. 检查字体文件是否成功加载

### 2. 检查控制台错误

在 **Console** 标签页中查看是否有字体加载相关的错误

### 3. 检查计算样式

1. 选择一个图标元素（如通知图标）
2. 在 **Elements** 标签页中查看
3. 检查计算样式中的 `font-family` 是否为 "Material Symbols Outlined"

### 4. 手动测试字体

在浏览器控制台中运行：
```javascript
document.fonts.check('12px "Material Symbols Outlined"')
```

如果返回 `false`，说明字体未加载。

## 可能的解决方案

如果字体仍未加载，可以尝试：

### 方案 1: 使用 next/font (推荐)

安装并使用 Next.js 的字体优化功能（需要 Next.js 13+）

### 方案 2: 使用 SVG 图标

使用 React Icons 或其他 SVG 图标库替代 Material Symbols

### 方案 3: 内联字体 CSS

在 `globals.css` 中确保字体链接正确加载

## 验证

重启开发服务器后，图标应该能够正常显示：
- ✅ 底部导航图标（home, aspireAI, offerMaker, settings）
- ✅ 通知图标（notifications）
- ✅ 所有使用 `material-symbols-outlined` 类的图标


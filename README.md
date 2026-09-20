# Sylunae Framework

从「丝月工坊」抽离的 React + TypeScript + Vite + Electron 应用壳。项目只包含 UI、桌面容器和通用交互，不包含笔记、任务、音乐、收藏等业务功能。

## 已包含

- shadcn/ui + Tailwind CSS v4 组件源码
- 丝月工坊同源的字体、Logo、浅色/深色设计令牌
- 可折叠、可拖拽、可持久化的左侧导航
- Electron 隐藏标题栏与原生窗口按钮区域
- 基础设置弹窗、主题跟随、全局 CSS 配色编辑、减少动效
- 路由级懒加载与统一加载状态
- Web、Electron、手机宽度响应式适配
- CSP、安全 preload、外部链接拦截
- Web 构建、桌面构建、测试、类型检查和 Windows 打包指令
- favicon、PWA manifest、SEO 与应用元数据占位

## 开始开发

```bash
npm install
npm run dev:web
npm run dev:desktop
```

常用检查与构建：

```bash
npm run typecheck
npm test
npm run check
npm run build:web
npm run build:desktop
npm run package:win
```

`npm run dev` 会同时启动 Web 与 Electron 开发进程，通常更推荐根据目标平台单独运行对应命令。Web 产物位于 `dist/`，Electron 产物位于 `out/`，安装包位于 `release/`。

## 新项目修改入口

- 应用名称与导航：`src/config/app.tsx`
- 默认颜色与运行时色板：`src/app/theme.ts`
- 字号、圆角与布局：`src/styles.css`
- Electron 窗口与 IPC：`electron/main/index.ts`
- SEO 与网页 metadata：`index.html`
- 桌面打包 metadata：`package.json` 的 `build`
- 图标：`public/icon.svg` 与 `build/icon.png`

添加新的 shadcn/ui 组件：

```bash
npx shadcn@latest add <component>
```

## 性能约定

- 页面通过 `React.lazy` 拆包；仅把会持续存在的全局 UI 放入 `App.tsx`。
- 侧栏拖动使用 `requestAnimationFrame` 直接更新 CSS 变量，只在拖动结束时持久化。
- 偏好设置与未来业务数据分域；不要把高频输入或播放进度塞进全局快照。
- Electron 只通过 `contextBridge` 暴露最小 API，renderer 不直接访问 Node.js。
- 大型列表默认采用分页或虚拟化；媒体数据独立存储，不进入普通 JSON 状态。

## 授权

框架代码采用 MIT License。字体授权与来源见 `public/fonts/`。

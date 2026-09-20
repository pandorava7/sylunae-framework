# 项目定位

本项目是可复用的 Sylunae Electron + Web 前端框架。它提供应用壳、设计系统、响应式布局与桌面容器，不承载任何特定产品的业务逻辑。

# 设计风格

- 延续丝月工坊的现代极简工具软件风格：低饱和中性色、克制阴影、柔和圆角、清晰层级。
- 桌面端采用左侧导航 + 右侧独立内容区；内容区与侧栏通过背景、圆角和轻阴影分层。
- 默认正文不低于 13px，辅助文字通常为 11–12px；不要为了塞入更多内容而牺牲可读性。
- 颜色必须使用 `src/app/theme.ts` 与 `src/styles.css` 中的语义 token，同时保证浅色、深色与高对比可读性；新增颜色时同步更新设置中的全局 CSS 色板。
- Logo 保持现有月亮图形；派生项目可以改名，但除非明确重做品牌，不要随意改变图形比例。

# 架构规则

- 应用名称、导航项和基础文案统一放在 `src/config/app.tsx`；不要在多个组件重复硬编码。
- 页面放在 `src/pages/` 并在 `src/App.tsx` 中懒加载。大型功能继续按页面或功能域拆包。
- UI 优先复用 `src/components/ui/` 的 shadcn/ui 组件；不要使用浏览器原生 `alert`、`confirm` 或 `prompt`。
- 样式以单一来源维护：已有 selector 或 token 能表达时，不新增覆盖补丁，不使用 `!important` 争夺层叠。
- Web 与 Electron 共用 renderer。平台差异通过 `window.sylunae` 能力检测，不通过 user-agent 猜测。
- Electron 必须保持 `contextIsolation: true`、`nodeIntegration: false`，并通过 preload 暴露窄接口；所有 IPC 输入在主进程校验。
- 不把密钥、文件系统能力或任意 shell 执行暴露给 renderer。

# 性能与数据规则

- 高频拖动、输入、播放进度等不得触发整个应用树的持久化；使用局部状态、节流/防抖，并在提交或失焦时写入。
- 大型媒体与二进制数据独立存储；普通设置保持小而可序列化。
- 长列表使用分页、窗口化或增量渲染；避免在 render 中执行昂贵排序、解析和深拷贝。
- Context 按变化频率和数据域拆分；不要创建包含全部业务状态的万能 Store。
- 副作用必须可清理，异步任务要支持取消或忽略过期结果。

# 交付检查

- 至少执行 `npm run typecheck`、`npm test`、`npm run build:web` 和 `npm run build:desktop`。
- UI 修改需检查浅色、深色、760px 以下手机布局和 Electron 标题栏。
- 修改 metadata 时同步检查 `src/config/app.tsx`、`index.html`、`public/site.webmanifest` 与 `package.json`。

# AGENT 开发前必看
* 保留现有品牌视觉；主题 token 统一在 `src/styles.css` 管理，同时验证浅色、深色与 Electron 环境。
* UI 优先复用现有组件库，标准弹窗、选择器、Tooltip 等不要重复造轮子，也不要使用浏览器原生 `alert / confirm / prompt`。
* 保持现有设计系统，颜色、主题和基础样式统一管理，并同时验证浅色、深色和桌面端环境。
* 正文与交互文字不要为了省空间过度缩小；输入框编辑过程中不要主动 `trim / split / filter` 用户尚未完成的内容。
* 注意桌面端与 Web 的资源路径差异，尤其是 Electron `file://` 环境，静态资源应使用兼容构建产物的相对路径。
* 高频输入、拖动、播放进度、计时器等操作不要触发完整状态保存，应按数据域增量持久化，并使用防抖、失焦或提交机制。
* 大型媒体数据应独立存储，避免在普通状态更新中反复序列化。
* 异步持久化需要保证事务、写入顺序和导入安全；修改数据结构时必须兼容旧数据并提供迁移。

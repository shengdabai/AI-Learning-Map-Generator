# AI 时代学习地图生成器

这个目录有两样东西：15 份离线阅读的 HTML 学习地图（3 个主题 × 5 种生成方式），和 1 份用来生成这类学习地图的提示词模板。
主入口和文件清单见 [索引.md](索引.md)，本文件只补使用说明。

## 使用说明

### 怎么打开
- 双击 `索引.md` 里「主学习地图入口」列出的三个 HTML，例如 `01-命令行工具基础-来源-Codex-CLI.html`。
- 页面是静态文件，不需要启动服务，也不需要安装依赖。
- ChatGPT 客户端、Codex CLI、Gemini 3.6 Flash 三个版本引用 `assets/` 里的 CSS 和 JS。移动或复制这些 HTML 时，要把 `assets/` 一起带走。

### 怎么用
1. 从三个主题里选一个：01 命令行工具基础、02 Claude 命令重要参数、03 Git 版本控制。
2. 想比较五种生成方式，打开 `00-十五份HTML全面对比报告.html`（文字版是 `00-十五份HTML全面对比报告.md`），表里每个版本都有「打开」链接。
3. 想为新主题生成同类学习地图，打开 `{tool-or-domain}-2026-07-29-mindset.zh.md`（英文版是 `.en.md`），把开头的 `{工具 / 技术 / 学科 / 方法论 / 领域}` 换成你的主题，再把整份提示词交给 AI。

### 数据存在哪
- 15 份 HTML 都不读写 localStorage 和 sessionStorage，也不发 fetch 请求，不保存任何数据。
- Claude Code 版和 Gemini 3.1 Pro 版从 `cdn.jsdelivr.net` 加载 Mermaid；Gemini 3.1 Pro 版还从 Google Fonts 加载 Inter 字体。
- 其余三个版本没有外部脚本和样式；正文里的参考链接只在你点击时才联网。

### 已知限制
- 断网时，Claude Code 版和 Gemini 3.1 Pro 版加载不到 Mermaid，图不会显示。
- `00-十五份HTML全面对比报告.md` 记录了 2026-07-30 的审核结果：Claude Code 版 02、03 在手机宽度下溢出；Gemini 3.6 Flash 版三页在 390px 宽度下宽到 710px；Codex CLI 版导航触控目标偏小。

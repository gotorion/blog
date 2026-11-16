# AGENTS.md

## 项目

李俊辉（lijunhui.me）：中文个人站点。Astro 7 + Markdown 内容集合，无 UI/CSS 框架，原生 CSS，部署于 Cloudflare Pages。首页有一处 three.js 的点阵点缀。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` | 构建到 `dist/`（改动后用于验证） |
| `npm run preview` | 预览生产构建 |

无 lint / test 脚本，不要杜撰。

## 结构

```
src/
  content.config.ts      blog 集合 schema
  content/blog/*.md      文章；文件名即 URL slug
  components/            HeroModel.astro（首页 three.js 点阵标签，程序化生成，无模型文件）、TableOfContents.astro（文章页目录）
  layouts/               BaseLayout（全站外壳、导航、社交链接）、BlogPostLayout（文章页）
  pages/                 index.astro（个人主页）、blog/index.astro（博客列表）、blog/[...slug].astro（文章页）
  styles/global.css      全部样式与设计令牌
public/fonts/            仓耳今楷字体（仅个人非商业授权）
```

## 内容规范

- 在 `src/content/blog/` 新建 `.md`，frontmatter 必填 `title`、`description`、`pubDate`；可选 `updatedDate`、`draft`、`tags`。
- 文件名用小写英文短横线（如 `why-i-started-blogging-again.md`）；重命名会改变 URL 并留下旧链接失效。
- `draft: true` 的文章不进入首页与构建。
- 正文用中文，标题与摘要简洁。

## 代码规范

- Astro 组件 + 原生 CSS；不引入 UI 框架、CSS 框架。客户端脚本仅两处：`src/components/HeroModel.astro`（three.js）和 `BaseLayout.astro` 里的 favicon 逐帧动画，其余保持零客户端脚本。
- 组件用 frontmatter TypeScript，props 定义 `interface Props`；遵循 `astro/tsconfigs/strict`。
- 样式集中在 `global.css`；颜色、字体、宽度一律用 `:root` 变量，不写死色值。three.js 里的颜色从 CSS 变量读取，不重复写色值。
- 站内链接与静态资源带 base 前缀：`const base = import.meta.env.BASE_URL.replace(/\/$/, "")`，再用 `${base}/path/`。
- 界面语言为中文（`<html lang="zh-CN">`）；日期用 `zh-CN`、`timeZone: "UTC"` 格式化。
- 设计基调：暖纸色背景、深蓝强调色、衬线正文、克制排版；动效只保留首页 3D 的缓慢自转，必须尊重 `prefers-reduced-motion`。
- 响应式断点：1040px（文章目录从右侧栏收回折叠）/ 880px / 480px / 360px。

## 改哪里

- 导航、站点名、社交链接与图标：`src/layouts/BaseLayout.astro`（图标来自 `simple-icons`）。
- 个人主页文案：`src/pages/index.astro`。
- 首页 3D 点缀：`src/components/HeroModel.astro`（曲面形状、配色、动画）；尺寸与遮罩在 `global.css` 的 `.hero-model`。
- 博客列表：`src/pages/blog/index.astro`。
- 文章页结构：`src/layouts/BlogPostLayout.astro`；目录与阅读进度条也在其中（目录条目来自 `TableOfContents.astro`，布局与样式在 `global.css` 的 `.post-body`、`.reading-progress`）。
- 站点地址：`astro.config.mjs`。

## 禁止

- 不提交 `dist/`、`.astro/`、`.wrangler/`、`.taste-skill/`、`node_modules/`。
- 不修改 `public/fonts/` 字体文件；商业使用需向仓耳字库取得授权。
- 不把生成产物当作源码编辑。

## 部署

`npm run build` 输出 `dist/`，由 Cloudflare Pages 托管：<https://lijunhui.me/>。

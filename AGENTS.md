# AGENTS.md

## 项目

Gotorion Blog：中文个人博客。Astro 7 + Markdown 内容集合，无 UI/CSS 框架，原生 CSS，部署于 Cloudflare Pages。

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
  layouts/               BaseLayout（全站外壳、导航、社交链接）、BlogPostLayout（文章页）
  pages/                 路由；blog/[...slug].astro 生成文章页
  styles/global.css      全部样式与设计令牌
public/fonts/            仓耳今楷字体（仅个人非商业授权）
```

## 内容规范

- 在 `src/content/blog/` 新建 `.md`，frontmatter 必填 `title`、`description`、`pubDate`；可选 `updatedDate`、`draft`、`tags`。
- 文件名用小写英文短横线（如 `why-i-started-blogging-again.md`）；重命名会改变 URL 并留下旧链接失效。
- `draft: true` 的文章不进入首页与构建。
- 正文用中文，标题与摘要简洁。

## 代码规范

- Astro 组件 + 原生 CSS；不引入 UI 框架、CSS 框架或客户端脚本。
- 组件用 frontmatter TypeScript，props 定义 `interface Props`；遵循 `astro/tsconfigs/strict`。
- 样式集中在 `global.css`；颜色、字体、宽度一律用 `:root` 变量，不写死色值。
- 站内链接与静态资源带 base 前缀：`const base = import.meta.env.BASE_URL.replace(/\/$/, "")`，再用 `${base}/path/`。
- 界面语言为中文（`<html lang="zh-CN">`）；日期用 `zh-CN`、`timeZone: "UTC"` 格式化。
- 设计基调：暖纸色背景、深蓝强调色、衬线正文、克制排版；避免装饰性动效。
- 响应式断点：880px / 480px / 360px。

## 改哪里

- 导航、站点名、社交链接与图标：`src/layouts/BaseLayout.astro`（图标来自 `simple-icons`）。
- 首页文案与文章列表：`src/pages/index.astro`。
- 文章页结构：`src/layouts/BlogPostLayout.astro`。
- 站点地址：`astro.config.mjs`。

## 禁止

- 不提交 `dist/`、`.astro/`、`.wrangler/`、`node_modules/`。
- 不修改 `public/fonts/` 字体文件；商业使用需向仓耳字库取得授权。
- 不把生成产物当作源码编辑。

## 部署

`npm run build` 输出 `dist/`，由 Cloudflare Pages 托管：<https://gotorion-blog.pages.dev/>。

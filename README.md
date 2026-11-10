# Gotorion 博客

一个使用 [Astro](https://astro.build/) 和 Markdown 内容集合构建的轻量博客。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产网站到 `dist/` |
| `npm run preview` | 预览生产构建 |

## 写文章

在 `src/content/blog/` 中添加 Markdown 文件。每篇文章都需要以下文件头：

```yaml
---
title: "文章标题"
description: "一句话摘要。"
pubDate: 2026-11-10
---
```

网站部署在 Cloudflare Pages：`https://gotorion-blog.pages.dev/`。

## 字体

网站使用仓耳今楷（Tsanger JinKai）02-W03，字体文件来自
[仓耳字库官网](https://www.tsanger.cn/product/32)。该字体允许个人非商业免费使用；
商业使用前需要向北京仓耳文字技术有限公司取得正式授权。

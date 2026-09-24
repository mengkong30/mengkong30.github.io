# TOK · 博客与设计作品集

线上地址：https://mengkong30.github.io/codex/

Astro 静态网站。推送到 main 后，GitHub Actions 自动构建并发布到 GitHub Pages。

## 本地开发

使用 Node.js 22，运行 `npm ci`、`npm run dev`。

发布构建由 Actions 设置子路径 `/codex`；本地开发仍使用根路径。
不要提交 `.env`、访问令牌、`node_modules` 或临时设计导出。

模板许可保留于 LICENSE。模板示例文章不参与站点发布。

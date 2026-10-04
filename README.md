# TOK · 博客与设计作品集

线上地址：https://mengkong.online/

Astro 静态网站。推送到 main 后，GitHub Actions 自动构建并发布到 GitHub Pages。

## 本地开发

使用 Node.js 22，运行 `npm ci`、`npm run dev`。

线上与本地都使用网站根路径 `/`。
不要提交 `.env`、访问令牌、`node_modules` 或临时设计导出。

模板许可保留于 LICENSE。模板示例文章不参与站点发布。

## Umami 统计接入

1. 已配置站长提供的公开 Website ID，对应 `mengkong.online`。
2. 如需切换站点，可在 GitHub 仓库 Settings → Secrets and variables → Actions → Variables 添加 `PUBLIC_UMAMI_ID` 覆盖默认 ID。不要使用 API 密钥。
3. 发布流程会在构建时读取此变量；为空时使用上面的默认 ID。本地开发和非正式域名不采集。
4. 发布后，在每个常用浏览器打开 `https://mengkong.online/?analytics=off` 排除自己的访问，再正常打开博客。需要恢复时打开 `?analytics=on`。清除网站数据后需重新设置。偏好链接本身不计数。
5. 用另一浏览器验证：访问首页、文章和刷新，确认后台浏览次数增加；访客数按 Umami 自身规则去重，不要求每次浏览增加一位访客。

在 Umami 后台分别查看“今日”和“近 30 天”的访客、浏览次数及访问来源，统一使用 Asia/Shanghai 时区。不要把每日访客相加当作跨日去重人数。新统计从实际启用后开始，旧不蒜子数据不合并。

页脚旧计数已停用；目前不公开展示新数字。若要在静态博客公开展示今日/近 30 天统计，还需要安全的汇总数据接口或定时生成汇总文件，不能把账号 API 密钥放到前端。

遵循浏览器 Do Not Track；存储不可访问时不加载统计。匿名统计仍可能有跨设备重复、拦截漏报及机器人流量，不能当成精确真人数。

统计排除页面 URL 查询参数及片段；来源链接只上报来源域名，不保留完整路径或参数。不上报自定义个人身份标识，不启用会话回放。

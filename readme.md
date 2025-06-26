# 技术栈

VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

markdown 语法
https://vitepress.dev/zh/guide/markdown#header-anchors

注意：最低到二级标题才能被搜索功能匹配关键字

## 运行

Node.js 18 及以上版本
```
npm install
npm run docs:dev
```

# 路由

在 ```docs/.vitepress/config.mjs```下配置新增文件的路径，图片等静态资源放在 ```public```目录下

生成的 HTML 页面是从源 Markdown 文件的目录结构映射而来的

```
docs           # 项目根目录 / 源目录
├─ .vitepress  # 配置目录
├─ public      # 静态资源，放图片,放置在 public 中的资源将按原样复制到输出目录的根目录中
├─ guide
│  ├─ getting-started.md
│  └─ index.md
├─ index.md
└─ prologue.md
```
生成的 HTML 页面会是这样：

```
index.md                  -->  /index.html (可以通过 / 访问)
prologue.md               -->  /prologue.html
guide/index.md            -->  /guide/index.html (可以通过 /guide/ 访问)
guide/getting-started.md  -->  /guide/getting-started.html
```
引用文件时，不需要.md后缀

# 本地构建与测试

可以运行以下命令来构建文档：
```
$ npm run docs:build
```
构建文档后，通过运行以下命令可以在本地预览它：
```
$ npm run docs:preview
```

# 平台部署指南
Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render
使用仪表板创建新项目并更改这些设置：

- 构建命令： ```npm run docs:build```
- 输出目录： ```docs/.vitepress/dist```
- node 版本： 20 (或更高版本)

不要为 HTML 代码启用 Auto Minify 等选项。它将从输出中删除对 Vue 有意义的注释。如果被删除，你可能会看到激活不匹配错误。
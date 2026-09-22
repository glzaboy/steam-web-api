# Steam Sda Web API

Steam Sda 的官网与管理后台前端。基于 Next.js（App Router）构建，并部署在 **Cloudflare Workers** 上；后端用户态与订阅数据存放在 **Cloudflare D1**（SQLite）数据库，通过 Drizzle ORM 访问。

本项目与桌面端工具 **steamsda**（C# / WPF）共用同一个 Azure 微软应用注册，支持：

- 浏览器内「跳转微软账号」直接登录（MSAL.js，PKCE）；
- 桌面端 WebView2 / 命令行版通过注入 `Authorization` 请求头自动完成认证，网站侧无需额外处理。

## 技术栈

| 分类 | 选型 |
| :--- | :--- |
| 框架 | Next.js 15（App Router）+ React 19 + TypeScript |
| 样式 | Tailwind CSS 4 + shadcn/ui（Radix） |
| 数据库 | Cloudflare D1（SQLite）+ Drizzle ORM |
| 部署 | `@opennextjs/cloudflare` → Cloudflare Workers |
| 认证 | `@azure/msal-browser`（微软账号登录 / Graph `/me`） |
| 工具 | wrangler、drizzle-kit、ESLint |

## 功能特性

- **微软账号登录**：点击「登录」跳转微软授权页，回跳后自动拉取用户昵称与已购订阅。
- **我的产品 / 订阅管理**：展示全部可订阅产品（`allProduct`）及当前账号已开通项（`product`），支持一键开通。
- **机器码绑定**：桌面端 / 命令行携带机器码调用 `/api/me`，后端做绑定校验。
- **明暗主题**：基于 `next-themes` 的主题切换。
- **响应式布局**：桌面端导航 + 移动端抽屉菜单。

## 环境要求

- Node.js 18+（建议 20+）
- 已安装依赖中的 `wrangler@^4.56`（用于本地 D1 与部署）

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 准备环境变量（参考下方「环境变量」）
cp .env.example .env   # 若不存在 .env.example，直接编辑 .env

# 3. 本地开发
npm run dev
# 打开 http://localhost:3000
```

> ⚠️ 必须用 `localhost` 或 `https` 访问：非安全上下文下 `crypto.subtle` 为 undefined，
> 微软登录会报 `crypto_nonexistent`。局域网 IP 访问同样不行。

## 环境变量

`.env` 关键项：

| 变量 | 说明 |
| :--- | :--- |
| `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` | 与 steamsda 桌面端共用的 Azure 应用（SPA）Client ID |
| `NEXT_PUBLIC_REDIRECT_URI` | 微软回跳地址，本地为 `http://localhost:3000` |
| `AUTH_SECRET` / `RESEND_API_KEY` | 见 `wrangler.jsonc`（线上建议改用 `wrangler secret put` 管理，勿明文提交） |

## 数据库（Cloudflare D1）

线上库：`steamsda-api`（绑定名 `DB`，database_id `234e2906-f23d-4ab9-8fae-184ebbe6e742`）。

- 表结构由 `./migrations` 管理，使用 `drizzle-kit` 生成 / 执行迁移。
- **导入 / 导出线上数据、本地联调**：详见 [`docs/开发说明.md`](./docs/开发说明.md)（含 wrangler 登录、整库导出、本地 D1 导入、CSV 导出等）。

核心数据表：`user`、`allProduct`、`product`、`machineBinding`；统一通过 `GET /api/me` 返回 `{ me, allProducts, products }`。

## 认证说明

- 后端 `app/api/me/route.ts` 只认请求头 `Authorization: Bearer <微软 access token>`，再用该令牌调用 Microsoft Graph `/me` 校验并取用户资料。
- 浏览器：AuthProvider 用 MSAL.js 走 `loginRedirect` / `handleRedirectPromise`，拿到令牌后自动带 `Bearer` 调 `/api/me`。
- 桌面端 / 命令行：在 WebView2 或 HTTP 客户端注入 `Authorization` 与 `machine-code` 请求头，网站侧发请求即可被识别（无需写 localStorage）。

## 部署

```bash
npm run build      # 本地构建产物
npm run preview    # 本地预览构建结果
npm run deploy     # 部署到 Cloudflare Workers
```

## 相关文档

- [开发说明（wrangler 登录 / 数据导出）](./docs/开发说明.md)

## 目录结构（概览）

```
steam-web-api/
├── app/                  # Next.js 路由与页面
│   ├── api/me/           # 用户态 / 订阅接口
│   ├── components/       # AuthProvider、Product 等业务组件
│   └── lib/auth/         # MSAL 配置（msalConfig.ts）
├── components/site/      # 站点级组件（header 等）
├── db/                   # Drizzle schema
├── migrations/           # D1 迁移文件
├── docs/开发说明.md       # wrangler 数据导出说明
├── wrangler.jsonc        # Cloudflare / D1 配置
└── drizzle.config.ts     # drizzle-kit 配置
```

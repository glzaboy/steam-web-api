# Steam Sda Web API（steam-web-api）

Steam Sda 的官网与管理后台前端。基于 **Next.js 16（App Router）+ React 19 + TypeScript** 构建，通过 **@opennextjs/cloudflare** 部署在 **Cloudflare Workers** 上；用户态与业务数据存放在 **Cloudflare D1**（SQLite）数据库，使用 **Drizzle ORM** 访问。

本项目与桌面端工具 **steamsda**（C# / WPF）共用同一个 Azure 微软应用注册，支持：

- 浏览器内「跳转微软账号」直接登录（MSAL.js，PKCE）；
- 桌面端 WebView2 / 命令行版通过注入请求头自动完成认证，网站侧无需额外处理。

线上地址：**https://steamsda.com**（Cloudflare Worker：`steam-web-api`，预览域 `https://steam-web-api.glzaboy.workers.dev`）。

---

## 技术栈

| 分类 | 选型 |
| :--- | :--- |
| 框架 | Next.js 16（App Router）+ React 19 + TypeScript 7 |
| 样式 | Tailwind CSS 4 + shadcn/ui（Radix UI） |
| 数据库 | Cloudflare D1（SQLite）+ Drizzle ORM |
| 部署 | `@opennextjs/cloudflare` → Cloudflare Workers |
| 认证 | `@azure/msal-browser`（微软账号登录 / Microsoft Graph `/me`） |
| 主题 | `next-themes`（明暗主题） |
| 工具 | wrangler、drizzle-kit、ESLint |

---

## 功能特性

- **微软账号登录**：点击「登录」跳转微软授权页，回跳后自动拉取用户昵称与已购订阅。
- **我的产品 / 订阅管理**：展示全部可订阅产品（`allProduct`）及当前账号已开通项（`product`），支持一键开通。
- **机器码绑定**：桌面端 / 命令行携带机器码调用接口，后端做绑定校验（可选能力）。
- **游戏库浏览**：首页「游戏分类」区 + 热门 / 所有游戏列表；分类详情页、平台详情页、游戏详情页与评论页，均带分页。
- **明暗主题**：基于 `next-themes` 的主题切换，跟随系统。
- **响应式布局**：桌面端导航 + 移动端抽屉菜单。

---

## 环境要求

- **Node.js 20+**（建议 22 LTS；项目使用 Turbopack，要求较新 Node）。
- `wrangler@^4`（随依赖安装，用于本地 D1 与部署）。
- 一个 Cloudflare 账号，且对 D1 数据库 `steamsda-api` 有访问权限。

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 准备环境变量（见下方「环境变量」）
#    项目已含 .env（含本地可用值）；本地开发还需 .env.development.local

# 3. 本地开发（默认 http://localhost:3000）
npm run dev
```

> ⚠️ 必须用 `localhost` 或 `https` 访问：非安全上下文下 `crypto.subtle` 为 `undefined`，
> 微软登录会报 `crypto_nonexistent`。用局域网 IP 访问同样不行。

---

## 环境变量

两类变量，两套机制，**不能混用**：

1. **浏览器端公开配置**（必须以 `NEXT_PUBLIC_` 前缀，Next 在构建时内联进客户端 bundle）：

   | 变量 | 说明 |
   | :--- | :--- |
   | `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` | 与 steamsda 桌面端共用的 Azure 应用（SPA）Client ID |
   | `NEXT_PUBLIC_REDIRECT_URI` | 微软回跳地址。本地 `http://localhost:3000`；线上 `https://steamsda.com` |

   - 本地开发专用覆盖放 `.env.development.local`（`NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000`），仅 `npm run dev` 生效，且已被 `.gitignore` 忽略，不会进仓库。
   - 这些变量在**构建时**就内联进客户端，修改后必须重新 `npm run deploy`。

2. **服务端密钥**（运行时读取，不进客户端 bundle）：`AUTH_SECRET`、`RESEND_API_KEY` 等通过 `wrangler.jsonc` 的 `vars` 或 `wrangler secret put` 注入；本地 dev 由 miniflare/wrangler 提供。

> ⚠️ 敏感信息（D1 Token、AUTH_SECRET、RESEND_API_KEY）切勿明文提交到仓库；线上请使用 `wrangler secret put` 管理。

---

## 目录结构

```
steam-web-api/
├── app/                      # Next.js 路由与页面（App Router）
│   ├── page.tsx             # 首页（游戏分类区 + 热门/所有游戏 + 产品订阅）
│   ├── categories/          # 分类列表 / 分类详情 [slug]
│   ├── platforms/           # 平台列表 / 平台详情 [name]
│   ├── game/[id]/           # 游戏详情 / 评论
│   ├── api/me/              # 用户态 / 订阅接口（GET）
│   ├── app-api/member/      # 会员相关内部接口（refresh-token / user/get）
│   ├── user/code/           # 登录回调处理
│   ├── components/          # AuthProvider、Product 等业务组件
│   └── lib/                 # db、auth（msalConfig）、mail 等
├── components/
│   ├── site/                # 站点级组件（header / footer）
│   ├── game/                # GameList / GameCard / ServerPagination
│   └── ui/                  # shadcn/ui 组件
├── db/
│   └── schema.ts            # Drizzle schema（User / AllProduct / Product / MachineBinding / categories / platforms / games）
├── migrations/              # D1 迁移文件（drizzle-kit 生成）
├── docs/开发说明.md          # wrangler 登录 / 数据导出导入 详细说明
├── wrangler.jsonc           # Cloudflare Worker / D1 / KV 配置
├── drizzle.config.ts        # drizzle-kit 配置（d1-http）
├── next.config.ts           # Next 配置（含 opennext cloudflare dev 初始化）
└── package.json
```

---

## 数据库（Cloudflare D1）

线上库：`steamsda-api`（绑定名 `DB`，`database_id` 见 `wrangler.jsonc` 的 `d1_databases`）。

- 表结构定义在 `db/schema.ts`，使用 `drizzle-kit` 生成 / 执行迁移（输出至 `./migrations`）。
- 生成迁移：`npx drizzle-kit generate`
- 推送到线上库：`npx drizzle-kit migrate`（走 `drizzle.config.ts` 的 `d1-http`，需本地 `.env` 的 `CLOUDFLARE_*` 凭证）
- 核心数据表：`User`、`AllProduct`、`Product`、`MachineBinding`、`categories`、`platforms`、`games`；统一通过 `GET /api/me` 返回 `{ me, allProducts, products }`。
- **导入 / 导出线上数据、本地联调**：详见 [`docs/开发说明.md`](./docs/开发说明.md)（含 wrangler 登录、整库导出、本地 D1 导入、CSV 导出、外键报错修复等）。

---

## 认证模型

- 后端 `app/api/me/route.ts` 只认请求头 `Authorization: Bearer <微软 access token>`，再用该令牌调用 Microsoft Graph `/me` 校验并取用户资料。
- **浏览器**：`AuthProvider` 用 MSAL.js 走 `loginRedirect` / `handleRedirectPromise`，拿到令牌后自动带 `Bearer` 调 `/api/me`。
- **桌面端 / 命令行**：在 WebView2 或 HTTP 客户端注入 `Authorization` 与 `machine-code` 请求头，网站侧发请求即可被识别（无需写 localStorage）。

---

## 本地开发

可用脚本（`package.json`）：

| 命令 | 说明 |
| :--- | :--- |
| `npm run dev` | 本地开发（Turbopack），默认 http://localhost:3000 |
| `npm run build` | 仅做 Next 构建校验（不含 Cloudflare 适配） |
| `npm run lint` | ESLint 检查 |
| `npm run deploy` | `opennextjs-cloudflare build` + `opennextjs-cloudflare deploy`，构建并部署到 Workers |
| `npm run preview` | 本地预览 Cloudflare 适配后的产物 |
| `npm run cf-typegen` | 生成 Cloudflare 绑定类型（`./cloudflare-env.d.ts`） |

类型检查（不生成产物）：

```bash
npx tsc --noEmit
```

本地联调数据库：首页与详情页含 D1 查询，本地需先 `wrangler d1 execute DB --local --file <dump.sql>` 灌入数据（见 [`docs/开发说明.md`](./docs/开发说明.md) 第 3 节）。

---

## 部署（Cloudflare Workers）

本项目用 `@opennextjs/cloudflare` 把 Next.js 打包成 Worker：

```bash
npm run deploy
# 等价于：
#   opennextjs-cloudflare build   # 生成 .open-next/
#   opennextjs-cloudflare deploy  # 上传到 Cloudflare Workers
```

- Worker 名：`steam-web-api`（见 `wrangler.jsonc`）。
- 绑定资源：`DB`（D1）、`KEY_CACHE`（KV）、`ASSETS`（静态资源）、`AUTH_SECRET`、`RESEND_API_KEY`。
- 自定义域：`https://steamsda.com`；预览域：`https://steam-web-api.glzaboy.workers.dev`。
- 部署需要 Cloudflare 账号凭据（本机 `wrangler login` 或 `CLOUDFLARE_API_TOKEN` 环境变量）。

> 注：`NEXT_PUBLIC_*` 变量在 `opennextjs-cloudflare build` 阶段内联进客户端 bundle，**改了回跳地址等必须重新 `npm run deploy`**，仅改服务端代码同理需重新部署。

---

## 常见问题 / 排错

- **部署报 `Another next build process is already running`**：本地 `npm run dev` 仍占用 `.next` 目录。先结束本地 dev 进程，再执行部署。
- **微软登录报 `crypto_nonexistent`**：非安全上下文导致。用 `http://localhost:3000` 或 `https` 访问，不要用局域网 IP。
- **本地 D1 导入报 `table already exists` / 外键 mismatch**：见 [`docs/开发说明.md`](./docs/开发说明.md) 第 3、5 节（清理本地库或调整索引顺序）。
- **`wrangler d1` 连不上 / 超时**：检查网络与 `CLOUDFLARE_ACCOUNT_ID`，确认账号对该 D1 有访问权限（`npx wrangler login`）。

---

## 相关文档

- [开发说明（wrangler 登录 / 数据导出导入）](./docs/开发说明.md)

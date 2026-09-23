# English 英语学习平台

一个前后端分离的英语学习全栈项目，涵盖用户系统、词库学习、AI 对话、课程购买（支付宝支付）等功能。

## 项目介绍

- **词库学习**：内置百万级英语词典（ECDICT），支持按考试标签（四六级/考研/雅思/托福/GRE 等）筛选，记录学习进度与掌握状态；
- **AI 对话**：基于 SSE（Server-Sent Events）流式输出的智能对话服务；
- **课程与支付**：课程购买、支付宝支付记录、订单状态流转；
- **打卡激励**：单词数量、打卡天数、积分/金币体系。

## 技术栈选型

| 层            | 技术                                             | 说明                                                             |
| ------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 包管理        | pnpm workspace                                   | monorepo 方案，硬链接节省磁盘，`workspace:*` 协议共享内部包      |
| 前端          | Vue 3 + Vite + TypeScript                        | `<script setup>` 组合式 API                                      |
| 前端 UI       | Element Plus + TailwindCSS v4                    | 组件库 + 原子化 CSS                                              |
| 前端状态/路由 | Pinia（+ persistedstate 持久化插件）+ vue-router | 嵌套路由 + layout 布局                                           |
| 后端          | NestJS 11（monorepo 模式）                       | apps/server（主 API）+ apps/ai（AI 服务）+ libs/shared（共享库） |
| ORM           | Prisma 7 + @prisma/adapter-pg                    | schema 声明式建模，生成 TS 类型安全的客户端                      |
| 数据库        | PostgreSQL 18                                    | 本地二进制安装并注册为 Windows 服务                              |
| 通信          | REST + SSE                                       | AI 流式响应使用 SSE 魔改（POST + fetch 读流）                    |
| 语言/运行时   | Node.js 22（fnm 管理）+ TypeScript               |                                                                  |

## 项目框架（目录结构）

```
English/
├── pnpm-workspace.yaml        # workspace 成员声明 + 构建脚本白名单
├── package.json               # 根脚本：pnpm web / server / ai / all
├── apps/
│   └── web/                   # @en/web 前端（Vue3 + Vite，端口 8080）
│       └── src/
│           ├── router/        # 按业务拆分的路由表（home、word-book...）
│           ├── layout/        # 布局组件（Header + Content 内嵌 RouterView）
│           ├── views/         # 页面
│           └── stores/        # Pinia
├── server/                    # NestJS monorepo 根
│   ├── apps/
│   │   ├── server/            # 主 API 应用（端口 3000）：user 等模块
│   │   └── ai/                # AI 应用（端口 3001）：chat 模块（SSE）
│   ├── libs/shared/           # 共享库：Prisma 模块、统一响应、拦截器/过滤器
│   │   └── src/generated/prisma/  # prisma generate 产物（客户端代码）
│   ├── prisma/
│   │   ├── schema.prisma      # 数据模型（User/WordBook/Course/PaymentRecord...）
│   │   └── migrations/        # 迁移 SQL
│   ├── prisma.config.ts       # Prisma 7 配置（读取 .env 的 DATABASE_URL）
│   └── .env                   # 环境变量（DATABASE_URL，不入库）
└── packages/
    ├── config/                # @en/config 公共配置（各服务端口等）
    └── common/                # @en/common 公共类型
```

架构要点：

- **monorepo**：一个仓库管理前端、两个后端应用、公共包；`@en/config` 等内部包通过 `workspace:*` 软链引用，改源码即时生效；
- **统一响应**：`libs/shared` 中的拦截器把 Controller 返回值包装为 `{ code, message, data, ... }`，异常由全局 ExceptionFilter 统一处理；
- **端口单一来源**：前后端端口统一维护在 `packages/config`，vite.config 与各 main.ts 都从这里读取。

## 环境要求

| 工具       | 版本                                                           |
| ---------- | -------------------------------------------------------------- |
| Node.js    | ≥ 22.22.3（推荐 22.23.x，用 fnm 管理）                         |
| pnpm       | 10.x（`npm i -g pnpm`，注意 npm 12 需 `--allow-scripts=pnpm`） |
| PostgreSQL | 18.x                                                           |

安装依赖（务必用 pnpm，npm 不支持 `workspace:` 协议）：

```bash
pnpm install
```

## 数据库启动方式

本项目使用本地安装的 PostgreSQL（二进制版），已通过 `pg_ctl register` 注册为 Windows 服务 `PostgreSQL-18`，数据目录 `D:\pg18_data`。

**方式一：Windows 服务（推荐，开机自启）**

```powershell
# 管理员 PowerShell
Start-Service PostgreSQL-18
Get-Service PostgreSQL-18        # 确认 Running
Set-Service PostgreSQL-18 -StartupType Automatic   # 设为自启
```

**方式二：手动启动**

```powershell
cd <pgsql>\bin
.\pg_ctl.exe start -D "D:\pg18_data"
```

**创建数据库：**

```powershell
.\psql.exe -h 127.0.0.1 -U postgres
# 输入密码后：
CREATE DATABASE english;
```

> 常见问题：若报「已存在的共享内存块仍在使用中」，说明有上次崩溃残留的 postgres 进程：
> `taskkill /F /IM postgres.exe` 后再启动。

**连接配置**：`server/.env`（不提交到仓库）：

```env
DATABASE_URL="postgresql://postgres:<你的密码>@localhost:5432/english?schema=public"
```

## 数据库导入方式

**1. 执行迁移建表**（根据 schema.prisma 在数据库中创建所有表）：

```bash
cd server
pnpm prisma migrate dev        # 开发环境：应用迁移 + 自动生成/更新客户端
# 已有迁移文件时（如 clone 后首次）：
pnpm prisma migrate deploy
```

**2. 生成 Prisma 客户端**（改了 schema.prisma 后必跑）：

```bash
pnpm prisma generate           # 产物输出到 libs/shared/src/generated/prisma
```

**3. 导入词典数据**（独立脚本 `index.js` + `ecdict.csv`，当前位于项目外的 `D:\learning\project\tools` 目录，需单独安装依赖并生成客户端）：

```bash
cd ..\tools                    # 或建议将其移入 English 仓库统一管理
npx prisma generate
npx tsx index.js               # 读取 ecdict.csv（GBK 编码），分批 2000 条写入 WordBook 表
```

> 注意：tools 里的 `generated/prisma` 必须由 tools 自己的 `prisma generate` 生成，
> 不可从其他项目拷贝——生成代码与 `@prisma/client` 运行时版本强耦合，跨版本会崩。

## 前后端启动方式

根目录 `package.json` 已配置脚本，在 **English 根目录**执行：

```bash
pnpm server        # 后端主 API（NestJS watch 模式，http://localhost:3000）
pnpm ai            # 后端 AI 服务（http://localhost:3001）
pnpm web           # 前端（Vite，http://localhost:8080）
pnpm all           # concurrently 一键并行启动三个服务
```

等价的分包命令：

```bash
pnpm --filter @en/server start:dev
pnpm --filter @en/server start:dev ai
pnpm --filter @en/web dev
```

## 其他约定

- 所有安装类命令使用 `pnpm`，禁用 `npm i`（会因 `workspace:*` 报 EUNSUPPORTEDPROTOCOL）；
- 新增带安装脚本的依赖时，`pnpm approve-builds` 中勾选批准（prisma、esbuild、vue-demi 等已加入白名单）；
- `node_modules`、`dist`、`.env` 均已在 `.gitignore` 中排除，切勿提交敏感配置。

# HOYODB - 米哈游游戏素材数据库

一个基于 Web 的米哈游游戏素材展示和下载平台，优先支持《崩坏：星穹铁道》，后续扩展至原神和绝区零。

## 项目结构

```
HOYODB/
├── client/              # 前端项目 (React + TypeScript + Vite + Ant Design)
│   ├── src/
│   │   ├── pages/      # 页面组件
│   │   ├── services/   # API 服务
│   │   └── App.tsx     # 主应用组件
│   └── package.json
├── server/              # 后端项目 (Node.js + Express + TypeScript + Prisma)
│   ├── src/
│   │   └── index.ts    # 服务器入口
│   ├── prisma/
│   │   └── schema.prisma  # 数据库模型
│   └── package.json
└── README.md
```

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios

### 后端
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT 认证

## 快速开始

### 环境要求
- Node.js >= 18
- PostgreSQL >= 14
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 配置环境变量

#### 后端配置 (server/.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/hoyodb?schema=public"
JWT_SECRET=your-secret-key
ALIST_BASE_URL=http://your-alist-url
ALIST_TOKEN=your-alist-token
```

#### 前端配置 (client/.env)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 初始化数据库

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

### 运行项目

```bash
# 运行后端 (在 server 目录)
npm run dev

# 运行前端 (在 client 目录，新终端)
npm run dev
```

访问:
- 前端: http://localhost:5173
- 后端: http://localhost:3000

## 开发计划

详见 [plan-hoyodb.prompt.md](./plan-hoyodb.prompt.md)

### 主要功能

1. ✅ 项目基础架构搭建
2. ⬜ 数据库模型设计和迁移
3. ⬜ 用户前端界面开发
4. ⬜ 管理后台开发
5. ⬜ Alist 云盘集成
6. ⬜ 文件预览和下载功能
7. ⬜ 搜索和筛选系统
8. ⬜ 统计和监控功能

## 数据库模型

项目使用 Prisma ORM，数据库模型包括：

- **Games**: 游戏信息（星穹铁道、原神、绝区零）
- **Categories**: 素材分类（音乐、图片、视频等）
- **Materials**: 素材详情
- **Tags**: 标签系统（角色、元素、版本等）
- **MaterialTags**: 素材标签关联
- **DownloadLogs**: 下载记录
- **Admins**: 管理员账户

## API 文档

API 文档将在开发完成后自动生成。

## 贡献指南

本项目目前处于开发阶段，暂不接受公开贡献。

## 许可证

待定

## 联系方式

项目维护者：HOYODB Team


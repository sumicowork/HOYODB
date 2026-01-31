# HOYODB 开发进度文档

> 最后更新: 2026-01-31

## 📌 项目概述

**HOYODB** 是一个米哈游游戏素材数据库网站，用于分享米哈游游戏（崩坏：星穹铁道、原神、绝区零）的音乐、图片等素材。

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + TypeScript + Vite + Fluent UI |
| 后端 | Express + TypeScript |
| 数据库 | PostgreSQL |
| ORM | Prisma 7 |
| 认证 | JWT |
| 文件存储 | OpenList (中国移动云盘) - 待集成 |

---

## ✅ 已完成功能

### 1. 项目基础架构 ✅

- [x] 前后端分离项目结构
- [x] TypeScript 配置
- [x] Prisma 7 配置（使用 adapter 模式）
- [x] PostgreSQL 数据库连接
- [x] 环境变量配置

### 2. 数据库设计 ✅

- [x] **Game 游戏表** - 支持多游戏
- [x] **Category 分类表** - 支持层级分类
- [x] **Material 素材表** - 核心素材数据
- [x] **Tag 标签表** - 多维度标签
- [x] **MaterialTag 关联表** - 素材-标签多对多
- [x] **DownloadLog 下载日志表** - 下载统计
- [x] **Admin 管理员表** - 管理员认证

### 3. 种子数据 ✅

- [x] 默认管理员账号 (admin / admin123)
- [x] 3个游戏：崩坏：星穹铁道、原神、绝区零
- [x] 8个分类：角色语音、BGM音乐、战斗音效、角色立绘、场景原画、UI素材、过场动画、其他
- [x] 14个标签：角色、稀有度、元素

### 4. 后端 API ✅

#### 公共 API（无需认证）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取游戏列表 | GET | `/api/games` | 返回已激活的游戏 |
| 获取游戏详情 | GET | `/api/games/:slug` | 包含分类信息 |
| 获取素材列表 | GET | `/api/materials` | 支持分页、筛选、搜索 |
| 获取素材详情 | GET | `/api/materials/:id` | 包含完整信息 |
| 记录下载 | POST | `/api/materials/:id/download` | 统计下载次数 |
| 获取标签列表 | GET | `/api/tags` | 支持按类型筛选 |
| 获取标签详情 | GET | `/api/tags/:slug` | 包含相关素材 |

#### 认证 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 管理员登录 | POST | `/api/auth/login` | 返回 JWT token |
| 验证 Token | GET | `/api/auth/verify` | 验证登录状态 |

#### 管理员 API（需要认证）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 仪表盘统计 | GET | `/api/admin/dashboard/stats` | 总览数据 |
| 游戏 CRUD | GET/POST/PUT/DELETE | `/api/admin/games` | 游戏管理 |
| 分类 CRUD | GET/POST/PUT/DELETE | `/api/admin/categories` | 分类管理 |
| 素材 CRUD | GET/POST/PUT/DELETE | `/api/admin/materials` | 素材管理 |
| 标签 CRUD | GET/POST/PUT/DELETE | `/api/admin/tags` | 标签管理 |

### 5. 前端基础 ✅

- [x] Vite + React 项目配置
- [x] API 服务层（axios 封装）
- [x] 路由配置（基础）
- [x] 基础页面框架

---

## 🚧 进行中

### 6. 前端页面开发

- [x] 首页 ✅
- [x] 游戏素材列表页 ✅
- [x] 素材详情页 ✅
- [x] 管理员登录页 ✅
- [x] 管理员仪表盘 ✅
- [x] 素材管理页面 ✅
- [x] 分类管理页面 ✅
- [x] 标签管理页面 ✅
- [x] 游戏管理页面 ✅

---

## 📋 待开发功能

### 7. OpenList 云盘集成

- [ ] 研究 OpenList API
- [ ] 实现文件上传接口
- [ ] 获取分享链接
- [ ] 文件管理功能

### 8. 前端功能完善

- [ ] 音频在线播放器
- [ ] 图片预览灯箱
- [ ] 搜索和筛选功能
- [ ] 响应式布局
- [ ] 暗色主题

### 9. 管理员功能

- [ ] 批量上传
- [ ] 批量编辑标签
- [ ] CSV/Excel 导入
- [ ] 素材预览

### 10. 其他功能

- [ ] 下载次数统计
- [ ] 热门素材排行
- [ ] 存储空间监控
- [ ] 每日访问量统计
- [ ] API 文档（Swagger）

---

## 📁 项目结构

```
HOYODB/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   │   ├── HomePage.tsx           # 首页
│   │   │   ├── GamePage.tsx           # 游戏素材列表页
│   │   │   ├── MaterialDetailPage.tsx # 素材详情页
│   │   │   └── admin/
│   │   │       ├── LoginPage.tsx      # 管理员登录
│   │   │       ├── DashboardPage.tsx  # 管理员仪表盘
│   │   │       └── MaterialsPage.tsx  # 素材管理
│   │   ├── services/
│   │   │   └── api.ts      # API 服务层
│   │   ├── App.tsx         # 主应用
│   │   └── main.tsx        # 入口文件
│   └── package.json
│
├── server/                 # 后端项目
│   ├── prisma/
│   │   ├── schema.prisma   # 数据库模型
│   │   ├── seed.ts         # 种子数据
│   │   └── migrations/     # 迁移文件
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── game.routes.ts
│   │   │   ├── material.routes.ts
│   │   │   ├── tag.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── middleware/     # 中间件
│   │   │   └── auth.middleware.ts
│   │   ├── prisma.ts       # Prisma 客户端
│   │   └── index.ts        # 服务器入口
│   ├── prisma.config.ts    # Prisma 7 配置
│   └── package.json
│
└── docs/                   # 文档
    └── PROGRESS.md         # 开发进度文档
```

---

## 🔧 本地开发

### 启动后端

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 启动前端

```bash
cd client
npm install
npm run dev
```

### 默认账号

- **用户名**: admin
- **密码**: admin123

> ⚠️ 请在生产环境中修改默认密码！

---

## 📊 开发统计

| 项目 | 完成度 |
|------|--------|
| 后端 API | 95% |
| 数据库设计 | 100% |
| 前端基础 | 100% |
| 前端页面 | 95% |
| OpenList 集成 | 0% |
| 整体进度 | **80%** |

---

## 📝 更新日志

### 2026-01-31 (晚上 - Fluent UI 迁移)

- ✅ 将前端从 Ant Design 迁移到 Fluent UI
- ✅ 重构首页使用 Fluent Design 风格
- ✅ 重构管理员登录页面
- ✅ 创建通用管理后台布局组件 (AdminLayout)
- ✅ 重构管理员仪表盘
- ✅ 重构素材管理页面
- ✅ 重构分类管理页面
- ✅ 重构标签管理页面
- ✅ 重构游戏管理页面
- ✅ 重构游戏素材列表页面
- ✅ 重构素材详情页面
- ✅ 使用 makeStyles 替代内联样式

### 2026-01-31 (晚上)

- ✅ 创建分类管理页面（CRUD）
- ✅ 创建标签管理页面（CRUD）
- ✅ 创建游戏管理页面（CRUD）
- ✅ 创建管理后台通用布局组件
- ✅ 统一管理后台侧边栏菜单

### 2026-01-31 (下午)

- ✅ 完善首页（游戏选择卡片、功能特色展示）
- ✅ 完善游戏素材列表页（分类筛选、搜索、分页）
- ✅ 完善素材详情页（音频播放、图片预览、下载）
- ✅ 完善管理员登录页（实际登录逻辑）
- ✅ 创建管理员仪表盘（统计数据、最近/热门素材）
- ✅ 创建素材管理页面（CRUD、筛选、搜索）
- ✅ 扩展前端 API 服务

### 2026-01-31 (上午)

- ✅ 修复 Prisma 7 配置问题
- ✅ 完成数据库迁移
- ✅ 创建种子数据
- ✅ 完成管理员 API (CRUD)
- ✅ 完成标签公共 API
- ✅ 创建认证中间件
- ✅ 扩展前端 API 服务


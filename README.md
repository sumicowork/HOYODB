# HOYODB - 米哈游游戏素材数据库

一个基于 Web 的米哈游游戏素材展示和下载平台，优先支持《崩坏：星穹铁道》，后续扩展至原神和绝区零。

## 🎮 功能特色

- 📁 **素材分类浏览** - 按游戏、分类、标签浏览素材
- 🔍 **搜索功能** - 快速搜索需要的素材
- 🎵 **在线预览** - 音频在线播放、图片预览
- ⬇️ **免费下载** - 所有素材免费下载
- 📊 **下载统计** - 自动记录下载次数
- 🔐 **管理后台** - 完整的素材管理系统

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Fluent UI |
| 后端 | Express + TypeScript + Prisma 7 |
| 数据库 | PostgreSQL |
| 认证 | JWT |

## 📁 项目结构

```
HOYODB/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── GamePage.tsx
│   │   │   ├── MaterialDetailPage.tsx
│   │   │   └── admin/      # 管理后台页面
│   │   ├── services/       # API 服务
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # 后端项目
│   ├── prisma/
│   │   ├── schema.prisma   # 数据库模型
│   │   └── seed.ts         # 种子数据
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # 中间件
│   │   └── index.ts
│   └── package.json
│
├── docs/                   # 文档
│   └── PROGRESS.md         # 开发进度
│
└── start-dev.ps1           # 启动脚本
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- npm

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/hoyodb.git
cd hoyodb
```

### 2. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 3. 配置数据库

编辑 `server/.env` 文件（参考 `.env.example`）：

```env
DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/hoyodb?schema=public"
JWT_SECRET="你的JWT密钥"
PORT=3000
```

### 4. 配置 OpenList 云盘（可选）

如果要使用文件上传功能，需要配置 OpenList WebDAV：

```env
# WebDAV 配置
WEBDAV_URL=http://localhost:5244/dav
WEBDAV_USERNAME=admin
WEBDAV_PASSWORD=your-password
WEBDAV_BASE_PATH=/hoyodb

# 公开访问 URL
OPENLIST_PUBLIC_URL=http://localhost:5244/d
```

确保 OpenList 已启动并配置了 WebDAV 访问权限。

### 5. 初始化数据库

```bash
cd server
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 6. 启动开发服务器

**方法一：使用启动脚本**

```powershell
.\start-dev.ps1
```

**方法二：手动启动**

```bash
# 终端1 - 启动后端
cd server
npm run dev

# 终端2 - 启动前端
cd client
npm run dev
```

### 7. 访问应用

- 前端首页: http://localhost:5173
- 管理后台: http://localhost:5173/admin/login
- 后端 API: http://localhost:3000

## 🔐 默认管理员账号

- **用户名**: `admin`
- **密码**: `admin123`

> ⚠️ 请在生产环境中修改默认密码！

## 📝 API 接口

### 公共 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/games` | 获取游戏列表 |
| GET | `/api/games/:slug` | 获取游戏详情 |
| GET | `/api/materials` | 获取素材列表 |
| GET | `/api/materials/:id` | 获取素材详情 |
| POST | `/api/materials/:id/download` | 记录下载 |
| GET | `/api/tags` | 获取标签列表 |

### 管理员 API（需要认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理员登录 |
| GET | `/api/admin/dashboard/stats` | 仪表盘统计 |
| CRUD | `/api/admin/games` | 游戏管理 |
| CRUD | `/api/admin/categories` | 分类管理 |
| CRUD | `/api/admin/materials` | 素材管理 |
| CRUD | `/api/admin/tags` | 标签管理 |

## 📊 素材分类

### 崩坏：星穹铁道

- 角色语音
- BGM音乐
- 战斗音效
- 角色立绘
- 场景原画
- UI素材
- 过场动画
- 其他

### 标签类型

- 角色 (CHARACTER)
- 元素 (ELEMENT)
- 稀有度 (RARITY)
- 版本 (VERSION)
- 场景 (SCENE)
- 其他 (OTHER)

## 🔄 开发进度

查看 [docs/PROGRESS.md](docs/PROGRESS.md) 了解详细开发进度。

## 📜 许可证

本项目仅供学习交流使用，素材版权归米哈游所有。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！


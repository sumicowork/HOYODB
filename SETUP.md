# HOYODB 项目设置指南

## 项目初始化完成 ✅

已成功搭建 HOYODB 项目的基础架构！

## 项目结构

```
HOYODB/
├── client/                    # 前端项目
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── GamePage.tsx
│   │   │   ├── MaterialDetailPage.tsx
│   │   │   └── admin/
│   │   │       └── LoginPage.tsx
│   │   ├── services/         # API 服务
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                  # 环境配置
│   └── package.json
│
├── server/                    # 后端项目
│   ├── src/
│   │   ├── routes/           # 路由
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── game.routes.ts
│   │   │   └── material.routes.ts
│   │   ├── index.ts          # 服务器入口
│   │   └── prisma.ts         # Prisma 客户端
│   ├── prisma/
│   │   ├── schema.prisma     # 数据库模型
│   │   └── seed.ts           # 种子数据
│   ├── .env                  # 环境配置
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── README.md
└── plan-hoyodb.prompt.md     # 项目计划文档
```

## 已安装的依赖

### 前端
- ✅ React 18
- ✅ TypeScript
- ✅ Vite
- ✅ Ant Design (UI 组件库)
- ✅ React Router (路由管理)
- ✅ Axios (HTTP 客户端)

### 后端
- ✅ Express (Web 框架)
- ✅ TypeScript
- ✅ Prisma (ORM)
- ✅ bcryptjs (密码加密)
- ✅ jsonwebtoken (JWT 认证)
- ✅ cors (跨域支持)
- ✅ multer (文件上传)

## 下一步操作

### 1. 配置数据库

在开始之前，需要安装并配置 PostgreSQL：

1. 下载并安装 PostgreSQL: https://www.postgresql.org/download/
2. 创建数据库：
   ```sql
   CREATE DATABASE hoyodb;
   ```

3. 更新 `server/.env` 中的数据库连接字符串：
   ```env
   DATABASE_URL="postgresql://你的用户名:你的密码@localhost:5432/hoyodb?schema=public"
   ```

### 2. 初始化数据库

在 `server` 目录下运行：

```bash
cd server

# 生成 Prisma 客户端
npm run prisma:generate

# 创建数据库迁移
npm run prisma:migrate

# 运行种子数据（创建初始数据）
npm run prisma:seed
```

**种子数据会创建：**
- 默认管理员账号（用户名: admin, 密码: admin123）
- 三个游戏（星穹铁道、原神、绝区零）
- 星铁的素材分类
- 基础标签（角色、元素、稀有度等）

### 3. 启动开发服务器

#### 启动后端（终端 1）
```bash
cd server
npm run dev
```
后端将运行在: http://localhost:3000

#### 启动前端（终端 2）
```bash
cd client
npm run dev
```
前端将运行在: http://localhost:5173

### 4. 访问应用

- **前端首页**: http://localhost:5173
- **管理员登录**: http://localhost:5173/admin/login
- **后端 API**: http://localhost:3000/api

### 5. 测试 API

可以使用以下方式测试 API：

```bash
# 获取游戏列表
curl http://localhost:3000/api/games

# 管理员登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取素材列表
curl http://localhost:3000/api/materials
```

### 6. 数据库管理

使用 Prisma Studio 可视化管理数据库：

```bash
cd server
npm run prisma:studio
```

Prisma Studio 将在浏览器中打开: http://localhost:5555

## API 路由

### 认证相关
- `POST /api/auth/login` - 管理员登录
- `GET /api/auth/verify` - 验证 token

### 游戏相关
- `GET /api/games` - 获取游戏列表
- `GET /api/games/:slug` - 获取游戏详情

### 素材相关
- `GET /api/materials` - 获取素材列表（支持分页、搜索、筛选）
- `GET /api/materials/:id` - 获取素材详情
- `POST /api/materials/:id/download` - 记录下载

## 数据库模型

### 核心表
- **games** - 游戏信息
- **categories** - 素材分类
- **materials** - 素材详情
- **tags** - 标签
- **material_tags** - 素材标签关联
- **download_logs** - 下载记录
- **admins** - 管理员

详细的模型定义见 `server/prisma/schema.prisma`

## 待开发功能

- [ ] 完善前端页面 UI
- [ ] 实现管理后台（素材上传、编辑、删除）
- [ ] 集成 Alist API
- [ ] 实现文件预览功能（音频播放器、图片查看器）
- [ ] 添加搜索和筛选功能
- [ ] 实现下载统计和热门排行
- [ ] 添加用户收藏功能
- [ ] 多语言支持

## 常见问题

### 数据库连接失败
- 确保 PostgreSQL 服务已启动
- 检查 `.env` 中的数据库连接字符串是否正确
- 确认数据库用户有足够的权限

### 端口被占用
- 前端端口 5173 或后端端口 3000 被占用时，可以修改端口：
  - 前端: 在 `client/vite.config.ts` 中修改
  - 后端: 在 `server/.env` 中修改 `PORT`

### TypeScript 编译错误
- 运行 `npm install` 确保所有依赖已安装
- 确保 TypeScript 版本兼容

## 开发建议

1. **使用 Git 版本控制**
   ```bash
   git init
   git add .
   git commit -m "Initial project setup"
   ```

2. **定期备份数据库**
   ```bash
   pg_dump hoyodb > backup.sql
   ```

3. **遵循代码规范**
   - 后续可添加 ESLint 和 Prettier
   - 使用 Husky 添加 Git hooks

4. **环境分离**
   - 开发环境使用 `.env`
   - 生产环境使用 `.env.production`
   - 不要将 `.env` 提交到版本控制

## 需要帮助？

如有问题，请查看：
- 项目计划: [plan-hoyodb.prompt.md](./plan-hoyodb.prompt.md)
- Prisma 文档: https://www.prisma.io/docs
- React 文档: https://react.dev
- Ant Design 文档: https://ant.design

---

**项目状态**: ✅ 基础架构搭建完成，可以开始开发了！


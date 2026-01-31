# ⚠️ 重要：首次运行前的必要步骤

## 关于 Prisma 客户端错误

如果您看到以下错误：
```
TS2305: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

**这是正常的！** 这是因为 Prisma 客户端还没有生成。

## 解决方法

在首次运行项目之前，**必须**执行以下步骤：

### 1. 安装并配置 PostgreSQL

确保 PostgreSQL 已安装并运行，然后创建数据库：

```sql
CREATE DATABASE hoyodb;
```

### 2. 配置环境变量

编辑 `server/.env` 文件，更新数据库连接字符串：

```env
DATABASE_URL="postgresql://你的用户名:你的密码@localhost:5432/hoyodb?schema=public"
```

### 3. 生成 Prisma 客户端

```powershell
cd server
npm run prisma:generate
```

这个命令会：
- ✅ 读取 `prisma/schema.prisma` 文件
- ✅ 生成 TypeScript 类型定义
- ✅ 创建 Prisma 客户端代码
- ✅ 将生成的代码放在 `node_modules/@prisma/client` 中

### 4. 创建数据库表

```powershell
npm run prisma:migrate
```

这个命令会：
- ✅ 根据 schema 创建数据库表
- ✅ 生成迁移文件
- ✅ 应用迁移到数据库

### 5. 导入初始数据

```powershell
npm run prisma:seed
```

这个命令会：
- ✅ 创建默认管理员账号
- ✅ 创建游戏数据
- ✅ 创建分类和标签

### 6. 启动开发服务器

现在可以启动项目了：

```powershell
# 在 server 目录
npm run dev
```

---

## 快速执行所有步骤

如果您已经配置好数据库和环境变量，可以一次性执行：

```powershell
cd server
npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed && npm run dev
```

---

## 使用初始化脚本（最简单）

我们提供了一个自动化脚本：

```powershell
# 在项目根目录
.\init.ps1
```

这个脚本会：
1. 检查 Node.js 和 PostgreSQL
2. 安装前后端依赖
3. 引导您完成数据库初始化
4. 提供启动说明

---

## 验证是否成功

成功生成 Prisma 客户端后：

1. ✅ TypeScript 错误应该消失
2. ✅ `node_modules/@prisma/client` 目录应该存在
3. ✅ 可以正常启动开发服务器
4. ✅ 可以访问 API 接口

---

## 常见问题

### Q: 为什么不把生成的客户端提交到 Git？
**A:** Prisma 客户端是根据您的 schema 动态生成的，不应该提交到版本控制。每个开发者都应该在本地生成。

### Q: 每次修改 schema 后需要重新生成吗？
**A:** 是的。修改 `schema.prisma` 后需要：
```powershell
npm run prisma:generate  # 重新生成客户端
npm run prisma:migrate   # 创建新的迁移
```

### Q: 可以在没有数据库的情况下开发前端吗？
**A:** 可以，但后端 API 无法运行。建议先配置好数据库再开始开发。

---

## 需要帮助？

查看完整文档：
- [SETUP.md](./SETUP.md) - 详细设置指南
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目总结

或参考 Prisma 官方文档：
- https://www.prisma.io/docs/getting-started


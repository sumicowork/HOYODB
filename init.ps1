# HOYODB 快速启动脚本
# 本脚本将帮助您初始化并启动 HOYODB 项目

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  HOYODB 项目初始化" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[1/5] 检查 Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 未找到 Node.js，请先安装 Node.js (https://nodejs.org/)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
Write-Host ""

# 检查 PostgreSQL
Write-Host "[2/5] 检查 PostgreSQL..." -ForegroundColor Yellow
$pgVersion = psql --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  未找到 PostgreSQL，请确保已安装并配置" -ForegroundColor Yellow
    Write-Host "   下载地址: https://www.postgresql.org/download/" -ForegroundColor Yellow
} else {
    Write-Host "✅ PostgreSQL 已安装: $pgVersion" -ForegroundColor Green
}
Write-Host ""

# 安装依赖
Write-Host "[3/5] 安装项目依赖..." -ForegroundColor Yellow

if (Test-Path ".\server\node_modules") {
    Write-Host "✅ 后端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "正在安装后端依赖..." -ForegroundColor Yellow
    Set-Location .\server
    npm install
    Set-Location ..
    Write-Host "✅ 后端依赖安装完成" -ForegroundColor Green
}

if (Test-Path ".\client\node_modules") {
    Write-Host "✅ 前端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "正在安装前端依赖..." -ForegroundColor Yellow
    Set-Location .\client
    npm install
    Set-Location ..
    Write-Host "✅ 前端依赖安装完成" -ForegroundColor Green
}
Write-Host ""

# 检查环境配置
Write-Host "[4/5] 检查环境配置..." -ForegroundColor Yellow
if (Test-Path ".\server\.env") {
    Write-Host "✅ 后端环境配置文件已存在" -ForegroundColor Green
    Write-Host "⚠️  请确保已配置正确的数据库连接字符串" -ForegroundColor Yellow
} else {
    Write-Host "❌ 未找到后端 .env 文件" -ForegroundColor Red
    Write-Host "   请复制 .env.example 为 .env 并配置数据库连接" -ForegroundColor Yellow
}
Write-Host ""

# 初始化数据库
Write-Host "[5/5] 初始化数据库..." -ForegroundColor Yellow
$initDb = Read-Host "是否初始化数据库？(需要先配置好 PostgreSQL 和 .env 文件) [Y/n]"
if ($initDb -eq "" -or $initDb -eq "Y" -or $initDb -eq "y") {
    Set-Location .\server
    Write-Host "正在生成 Prisma 客户端..." -ForegroundColor Yellow
    npm run prisma:generate

    Write-Host "正在创建数据库迁移..." -ForegroundColor Yellow
    npm run prisma:migrate

    Write-Host "正在导入种子数据..." -ForegroundColor Yellow
    npm run prisma:seed

    Set-Location ..
    Write-Host "✅ 数据库初始化完成" -ForegroundColor Green
} else {
    Write-Host "⏭️  跳过数据库初始化" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  初始化完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "接下来请按以下步骤启动项目：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  启动后端 (在新终端中)：" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  启动前端 (在另一个新终端中)：" -ForegroundColor Cyan
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  访问应用：" -ForegroundColor Cyan
Write-Host "   前端: http://localhost:5173" -ForegroundColor White
Write-Host "   后端: http://localhost:3000" -ForegroundColor White
Write-Host "   管理员登录: http://localhost:5173/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "📝 默认管理员账号：" -ForegroundColor Yellow
Write-Host "   用户名: admin" -ForegroundColor White
Write-Host "   密码: admin123" -ForegroundColor White
Write-Host ""
Write-Host "更多信息请查看 SETUP.md 文件" -ForegroundColor Gray
Write-Host ""


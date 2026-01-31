# HOYODB 启动脚本
# 同时启动前端和后端开发服务器

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       HOYODB 开发环境启动脚本         " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检查 PostgreSQL 连接
Write-Host "[1/4] 检查数据库连接..." -ForegroundColor Yellow

# 启动后端
Write-Host "[2/4] 启动后端服务器..." -ForegroundColor Yellow
$serverPath = Join-Path $PSScriptRoot "server"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# 启动前端
Write-Host "[3/4] 启动前端服务器..." -ForegroundColor Yellow
$clientPath = Join-Path $PSScriptRoot "client"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "[4/4] 启动完成!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  前端地址: http://localhost:5173      " -ForegroundColor White
Write-Host "  后端地址: http://localhost:3000      " -ForegroundColor White
Write-Host "  管理后台: http://localhost:5173/admin/login" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "默认管理员账号: admin / admin123" -ForegroundColor Yellow
Write-Host ""


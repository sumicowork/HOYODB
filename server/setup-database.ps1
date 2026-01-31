# HOYODB 数据库配置向导

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  HOYODB 数据库配置" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 获取数据库配置信息
Write-Host "请输入您的 PostgreSQL 配置信息：" -ForegroundColor Yellow
Write-Host ""

$dbUser = Read-Host "数据库用户名 (默认: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "数据库密码" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbHost = Read-Host "数据库主机 (默认: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbPort = Read-Host "数据库端口 (默认: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "5432"
}

$dbName = Read-Host "数据库名称 (默认: hoyodb)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "hoyodb"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 构建连接字符串
$connectionString = "postgresql://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/${dbName}?schema=public"

# 更新 .env 文件
$envPath = ".\.env"
$envContent = Get-Content $envPath -Raw
$envContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$connectionString`""
Set-Content -Path $envPath -Value $envContent

Write-Host "✅ 数据库配置已保存到 .env 文件" -ForegroundColor Green
Write-Host ""

# 测试数据库连接
Write-Host "正在测试数据库连接..." -ForegroundColor Yellow
$testResult = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 数据库连接成功！" -ForegroundColor Green
    Write-Host ""

    # 检查数据库是否存在
    Write-Host "正在检查数据库 '$dbName' 是否存在..." -ForegroundColor Yellow
    $checkDb = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName';" 2>&1

    if ($checkDb -eq "1") {
        Write-Host "✅ 数据库 '$dbName' 已存在" -ForegroundColor Green
    } else {
        Write-Host "⚠️  数据库 '$dbName' 不存在，正在创建..." -ForegroundColor Yellow
        psql -U $dbUser -h $dbHost -p $dbPort -d postgres -c "CREATE DATABASE $dbName;" 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 数据库 '$dbName' 创建成功！" -ForegroundColor Green
        } else {
            Write-Host "❌ 创建数据库失败，请手动执行：" -ForegroundColor Red
            Write-Host "   CREATE DATABASE $dbName;" -ForegroundColor White
        }
    }

    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "  下一步操作" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  生成 Prisma 客户端：" -ForegroundColor Yellow
    Write-Host "   npm run prisma:generate" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  创建数据库表：" -ForegroundColor Yellow
    Write-Host "   npm run prisma:migrate" -ForegroundColor White
    Write-Host ""
    Write-Host "3️⃣  导入初始数据：" -ForegroundColor Yellow
    Write-Host "   npm run prisma:seed" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  启动开发服务器：" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""

} else {
    Write-Host "❌ 数据库连接失败！" -ForegroundColor Red
    Write-Host "   请检查：" -ForegroundColor Yellow
    Write-Host "   1. PostgreSQL 服务是否已启动" -ForegroundColor White
    Write-Host "   2. 用户名和密码是否正确" -ForegroundColor White
    Write-Host "   3. 主机和端口是否正确" -ForegroundColor White
    Write-Host ""
    Write-Host "   您可以手动编辑 .env 文件更新配置" -ForegroundColor Yellow
    Write-Host ""
}


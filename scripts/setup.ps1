# Sweet Shop Management System - Setup Script (PowerShell)

Write-Host "🍬 Sweet Shop Management System - Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18+ first." -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
npm install

Set-Location ..

Write-Host ""
Write-Host "✅ All dependencies installed!" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "⚙️  Setting up environment files..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created backend\.env (using SQLite by default)" -ForegroundColor Green
    Write-Host "   Please edit backend\.env if you want to use PostgreSQL" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  backend\.env already exists, skipping..." -ForegroundColor Cyan
}

if (-not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Created frontend\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  frontend\.env already exists, skipping..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review and edit backend\.env if needed"
Write-Host "2. Run 'npm run dev' to start both backend and frontend"
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Yellow


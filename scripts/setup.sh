#!/bin/bash

echo "🍬 Sweet Shop Management System - Setup Script"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "Installing root dependencies..."
npm install

echo ""
echo "Installing backend dependencies..."
cd backend
npm install

echo ""
echo "Installing frontend dependencies..."
cd ../frontend
npm install

cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."
echo ""

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (using SQLite by default)"
    echo "   Please edit backend/.env if you want to use PostgreSQL"
else
    echo "ℹ️  backend/.env already exists, skipping..."
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "ℹ️  frontend/.env already exists, skipping..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and edit backend/.env if needed"
echo "2. Run 'npm run dev' to start both backend and frontend"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"


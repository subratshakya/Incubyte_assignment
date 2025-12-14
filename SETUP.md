# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v18+) installed: `node --version`
- ✅ npm installed: `npm --version`
- ✅ Git installed (for version control)

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend (SQLite - Easiest)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=my-super-secret-jwt-key-12345
DATABASE_TYPE=sqlite
DATABASE_PATH=./sweet_shop.db
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

The `.env` file should already have:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Run the Application

From the root directory:
```bash
npm run dev
```

This starts:
- ✅ Backend on http://localhost:3001
- ✅ Frontend on http://localhost:3000

### 5. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Register" to create an account
3. Login with your credentials
4. Start managing sweets!

## Using PostgreSQL (Optional)

If you prefer PostgreSQL:

1. Install PostgreSQL
2. Create database: `createdb sweet_shop`
3. Update `backend/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/sweet_shop
```
(Remove DATABASE_TYPE and DATABASE_PATH lines)

## Running Tests

```bash
# All tests
npm test

# Backend only
cd backend && npm test

# Frontend only
cd frontend && npm test
```

## Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/package.json` scripts

### Database Connection Error
- Check `.env` file configuration
- For SQLite: Ensure write permissions in backend directory
- For PostgreSQL: Verify database exists and credentials are correct

### Module Not Found
- Delete `node_modules` and run `npm install` again
- Ensure you're in the correct directory

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check API documentation in README
- Review test coverage reports
- Explore the codebase structure

Happy coding! 🍬


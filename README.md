# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop, built with modern technologies and following best practices including Test-Driven Development (TDD).

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [My AI Usage](#my-ai-usage)

## ✨ Features

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Sweet Management**: CRUD operations for sweets (Create, Read, Update, Delete)
- **Inventory Management**: Purchase and restock functionality
- **Search & Filter**: Search sweets by name, category, and price range
- **Database Support**: PostgreSQL and SQLite support

### Frontend Features
- **Modern UI**: Responsive, beautiful interface with gradient design
- **User Authentication**: Login and registration forms
- **Dashboard**: View all available sweets in a grid layout
- **Search & Filter**: Real-time search and filtering capabilities
- **Purchase Functionality**: Purchase sweets with quantity selection
- **Admin Panel**: Add, edit, delete, and restock sweets (admin only)
- **Stock Management**: Visual indicators for low stock and out-of-stock items

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with SQLite fallback)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern design patterns
- **Testing**: React Testing Library

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Database configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # Authentication controllers
│   │   │   └── sweet.controller.ts  # Sweet management controllers
│   │   ├── middleware/
│   │   │   └── auth.ts               # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # Auth routes
│   │   │   └── sweet.routes.ts      # Sweet routes
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Authentication business logic
│   │   │   └── sweet.service.ts     # Sweet business logic
│   │   ├── __tests__/               # Backend tests
│   │   └── index.ts                 # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── context/                 # React context (Auth)
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── __tests__/               # Frontend tests
│   │   └── App.tsx                  # Main app component
│   ├── public/
│   └── package.json
├── package.json                     # Root package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (optional, SQLite can be used instead)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd sweet-shop-management
```

### Step 2: Install Dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

**Option 1: PostgreSQL**
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/sweet_shop
```

**Option 2: SQLite (Easier for development)**
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_TYPE=sqlite
DATABASE_PATH=./sweet_shop.db
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Step 4: Set Up Database (PostgreSQL only)

If using PostgreSQL, create the database:

```bash
createdb sweet_shop
```

The application will automatically create the required tables on first run.

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Both Backend and Frontend Together

From the root directory:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend app on `http://localhost:3000`

#### Option 2: Run Separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm start
```

### Production Mode

**Build Backend:**
```bash
cd backend
npm run build
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder using a static server
```

## 🧪 Testing

### Run All Tests

From the root directory:
```bash
npm test
```

### Backend Tests

```bash
cd backend
npm test
npm run test:watch      # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Sweet Endpoints (Protected - Requires JWT Token)

All sweet endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=Candy&minPrice=1&maxPrice=10
Authorization: Bearer <token>
```

#### Create Sweet (Admin only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.50,
  "quantity": 100
}
```

#### Update Sweet
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 3.00
}
```

#### Delete Sweet (Admin only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

#### Restock Sweet (Admin only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50
}
```

## 🤖 My AI Usage

### AI Tools Used

1. **GitHub Copilot / Cursor AI**: Used extensively throughout the development process
2. **ChatGPT**: Used for brainstorming API structures and debugging complex issues

### How AI Was Used

#### 1. **Code Generation**
- **Initial Project Structure**: Used AI to generate the basic project structure and boilerplate code for both backend and frontend
- **Type Definitions**: AI helped generate TypeScript interfaces and type definitions
- **Database Schema**: AI assisted in designing the database schema and migration logic

#### 2. **Test Writing**
- **Unit Tests**: AI generated initial test structures and test cases for services
- **Mock Objects**: Used AI to create mock database implementations for testing
- **Test Coverage**: AI helped identify edge cases and additional test scenarios

#### 3. **Code Refactoring**
- **Service Layer**: AI suggested improvements to the service layer architecture
- **Error Handling**: AI helped implement consistent error handling patterns
- **Code Organization**: AI provided suggestions for better code organization and separation of concerns

#### 4. **Documentation**
- **API Documentation**: AI helped structure the API documentation section
- **README**: AI assisted in creating comprehensive README with clear instructions

#### 5. **Debugging**
- **Database Issues**: AI helped debug SQLite compatibility issues with PostgreSQL-style queries
- **TypeScript Errors**: AI assisted in resolving TypeScript type errors
- **React Component Issues**: AI helped fix React component state management issues

### Reflection on AI Impact

**Positive Impacts:**
- **Speed**: Significantly accelerated development by generating boilerplate code
- **Best Practices**: AI suggestions helped maintain consistent coding patterns
- **Learning**: AI explanations helped understand complex concepts better
- **Error Prevention**: AI caught potential bugs early in the development process

**Challenges:**
- **Over-reliance**: Had to be careful not to blindly accept AI suggestions without understanding
- **Context Switching**: Sometimes AI suggestions didn't match the project's specific requirements
- **Testing**: AI-generated tests sometimes needed manual refinement to match actual requirements

**Workflow Integration:**
- Used AI as a pair programming partner, iterating on suggestions
- Always reviewed and understood AI-generated code before committing
- Used AI to explain complex code sections for better understanding
- Leveraged AI for quick prototyping, then manually refined the code

**Ethical Considerations:**
- All AI-generated code was reviewed and understood before use
- No code was copied from other repositories
- All commits reflect actual understanding and modifications
- AI was used as a tool to enhance productivity, not replace critical thinking

### AI Co-Authorship

Following the project requirements, AI tools were used as co-authors in commits. Example commit message format:

```
feat: Implement user authentication with JWT

Added JWT-based authentication system with register and login endpoints.
Used AI to generate initial service layer structure and then manually
added validation and error handling.

Co-authored-by: Cursor AI <ai@cursor.sh>
```

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Admin Panel
![Admin Panel](screenshots/admin.png)

*Note: Screenshots should be added to the `screenshots/` directory*

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to:
- **Heroku**: Easy deployment with PostgreSQL addon
- **AWS**: EC2 or Elastic Beanstalk
- **Railway**: Simple deployment with database support
- **DigitalOcean**: App Platform

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Recommended for React apps
- **Netlify**: Easy static site hosting
- **AWS S3 + CloudFront**: Scalable static hosting

### Environment Variables for Production

Make sure to set secure environment variables:
- Use a strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Configure production database URL
- Update frontend API URL to point to production backend

## 📝 License

This project is created for educational purposes as part of the AI Kata challenge.

## 👤 Author

Subrat Shakya
## 🙏 Acknowledgments

- Incubyte for providing the kata challenge
- The open-source community for excellent tools and libraries
- AI tools that enhanced the development experience

---

**Note**: This project was built following TDD principles and includes comprehensive test coverage. All AI usage has been documented transparently as per the project requirements.


# Todo Backend API

A MERN stack backend with authentication and todo management.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env


### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password/:token` | Reset password | No |

### Todos

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/todos` | Get all todos | Yes |
| GET | `/api/todos/:id` | Get single todo | Yes |
| POST | `/api/todos` | Create todo | Yes |
| PUT | `/api/todos/:id` | Update todo | Yes |
| PATCH | `/api/todos/:id/toggle` | Toggle completion | Yes |
| DELETE | `/api/todos/:id` | Delete todo | Yes |
| DELETE | `/api/todos` | Delete all completed | Yes |

---

## Request Examples

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Todo
```json
POST /api/todos
Authorization: Bearer <token>
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

---

## Frontend Integration

Update your frontend API base URL:

```javascript
const API_URL = 'http://localhost:5000/api';
```

Store the JWT token after login and include it in headers:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

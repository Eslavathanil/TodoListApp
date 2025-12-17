# To-Do List Application

The **To-Do List Application** is a simple yet powerful tool designed to help users manage their daily tasks efficiently. It allows users to create, read, update, and delete tasks in an organized manner. This project is implemented as a **full-stack application**, with a **frontend** for user interaction and a **backend** for storing and managing tasks.
## 🌐 Live URLs

- **Web Application** [https://todolistapp-2-88z2.onrender.com](https://todolistapp-2-88z2.onrender.com) 

## **Key Features**
- **Add Tasks** – Users can add new tasks with titles, descriptions, and deadlines.  
- **View Tasks** – Displays a list of all tasks in a clean and organized interface.  
- **Edit Tasks** – Users can update task details if there are changes.  
- **Delete Tasks** – Remove tasks that are completed or no longer needed.  
- **Mark as Complete** – Users can mark tasks as done for easy tracking.  
- **Responsive Design** – Works well on both desktop and mobile devices.  
- **Search & Filter (Optional)** – Filter tasks by status (completed/pending) or search by title.  
### Login Page
<img src="https://res.cloudinary.com/dp8gu4t9m/image/upload/v1765977413/Screenshot_2025-12-17_183507_dpojwb.png" alt="Login Page" width="600" height="400">

### Dashboard
<img src="https://res.cloudinary.com/dp8gu4t9m/image/upload/v1765977414/Screenshot_2025-12-17_184437_wi3qug.png" alt="Dashboard" width="1000" height="600">


## **Technologies Used**
- **Frontend:** HTML, CSS, JavaScript, React.js (or plain HTML/CSS/JS)  
- **Backend:** Node.js with Express.js  
- **Database:** MongoDB (for storing tasks)  
- **Other Tools:** Axios (for API calls), dotenv (for environment variables), CORS  

## **How It Works**
1. Users interact with the **frontend interface** to add or manage tasks.  
2. The frontend sends **HTTP requests** to the backend API.  
3. The backend handles the requests, performs CRUD operations on the **database**, and returns updated data.  
4. The user interface updates in real-time to reflect changes in tasks.  


## **Use Cases**
- Personal task management  
- Work and project planning  
- Study schedules for students  
- Grocery lists or reminders  

## **Benefits**
- Organizes daily activities efficiently.  
- Reduces the chance of forgetting important tasks.  
- Helps in prioritizing work.  
- Improves productivity through better task tracking.  
 

## **Project Structure**
```
To-Do-List-Application/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── components.json
│   └── README.md
│
└── .gitignore

```
## 1. Application Architecture

The application follows a **client-server architecture**:
```
  +--------------------+          HTTP/API         +--------------------+
  |                    | <--------------------->  |                    |
  |     Frontend       |                          |      Backend       |
  |   (React.js)       |                          |    (Node.js + DB)  |
  |                    |                          |                    |
  +--------------------+                          +--------------------+
           |                                               |
           | User Actions (CRUD tasks)                     |
           v                                               v
   +--------------------+                         +--------------------+
   |  Components / UI   |                         |   Routes / APIs    |
   | - Login / Signup   |                         | - Tasks CRUD       |
   | - Dashboard        |                         | - User Auth        |
   | - Task List        |                         | - Categories       |
   +--------------------+                         +--------------------+
           |                                               |
           v                                               v
   +--------------------+                         +--------------------+
   | State Management   |                         |  Database (MongoDB)|
   | - Context / Hooks  |                         |  - Users           |
   | - API Services     |                         |  - Tasks           |
   +--------------------+                         +--------------------+
```

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

## Frontend Setup

The frontend of the To-Do List Application is built using **React + Vite**. It provides a modern, fast, and responsive interface for managing tasks, while communicating with the backend API to perform CRUD operations.

---

## 🛠️ Tech Stack
- **React + Vite** – Fast and modern frontend framework for building reactive UI  
- **Axios** – Handles API requests to the backend  
- **CSS / Tailwind** – Styling the interface (optional, can use plain CSS)

---

## Installation & Setup

1. Navigate to the frontend folder

cd frontend

2. Install dependencies

npm install

3. Start the frontend server

npm run dev

The frontend will run on http://localhost:5173 (default Vite port).

 4. Connecting Frontend to Backend
Update the API base URL in your frontend code 
Ensure the backend server is running and accessible for the frontend to work correctly
---
## 👨‍💻 Author

**Anil Eslavath**  
GitHub: [https://github.com/Eslavathanil](https://github.com/Eslavathanil)


# TaskFlow — React Task Management Frontend

A responsive React frontend for managing tasks through a secure REST API.

TaskFlow provides user authentication and complete task management functionality with a clean and responsive interface.

## 🚀 Live Demo

**Frontend:**  
https://task-management-api-wheat-alpha.vercel.app

**Backend API:**  
https://task-management-api-m54c.onrender.com

**Backend Repository:**  
https://github.com/mohan5535/Task-Management-API

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- Context API
- React Hooks
- Fetch API
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

---

## ✨ Features

- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure logout
- Live task data from REST API
- Create tasks
- View task list
- View task details
- Edit tasks
- Delete tasks
- Task status management
- Client-side form validation
- Loading states
- Error handling
- Responsive mobile and desktop UI
- PostgreSQL database integration
- Production API integration

---

## 📌 Application Routes

| Route | Description |
|---|---|
| `/login` | User login |
| `/register` | Create a new account |
| `/tasks` | View all tasks |
| `/tasks/new` | Create a new task |
| `/tasks/:id` | View task details |
| `/tasks/:id/edit` | Edit an existing task |

---

## 🔐 Authentication

TaskFlow uses JWT authentication.

After successful login:

1. The backend returns a JWT token.
2. The frontend stores the token locally.
3. Protected API requests send the token using the `Authorization` header.
4. Users without a valid token cannot access protected task routes.

---

## 🔗 API Integration

The frontend communicates with the Task Management REST API.

### Authentication Endpoints

```text
POST /api/auth/register
POST /api/auth/login
# 👑 Major Project (MERN Stack)

A premium **Full-Stack MERN Task Management Application** built with **MongoDB, Express.js, React.js, and Node.js**. The application provides secure authentication, task management, dashboard analytics, category management, and a modern responsive glassmorphism interface.

---

## 🌐 Live Demo

**Frontend:** *(Add your deployed frontend URL here)*

**Backend API:** *(Add your deployed backend URL here)*

---

## 📂 GitHub Repository

https://github.com/NANIPRABHAS1302/Royal-Task-Manager-MERN

---

# 📖 Project Overview

Royal Task Manager is a modern productivity platform that enables users to organize, manage, and monitor their daily tasks efficiently.

The application includes secure user authentication, intelligent task organization, category management, analytics dashboards, and a beautiful responsive user interface.

---

# 🚀 Features

## 🔐 Authentication

- User Registration
- User Login
- Secure Logout
- JWT Authentication
- Protected Routes
- Forgot Password
- Reset Password
- Password Encryption using bcrypt

---

## 👤 User Profile

- View Profile
- Update Profile
- Change Password

---

## 📋 Task Management

- Create Task
- Edit Task
- Delete Task
- Mark Complete
- Undo Complete
- Task Priorities
- Due Dates
- Categories

---

## 🔍 Search & Filtering

- Search Tasks
- Filter by Status
- Filter by Category
- Filter by Priority
- Sort Tasks
- Pagination

---

## 📊 Dashboard

- Total Tasks
- Completed Tasks
- Pending Tasks
- Productivity Statistics
- Weekly Analytics
- Charts & Graphs

---

## 🎨 User Interface

- Modern Glassmorphism Design
- Responsive Layout
- Dark Mode
- Light Mode
- Animated Components
- Toast Notifications
- Loading Indicators
- Skeleton Loaders
- Beautiful Dashboard

---

## 🛡 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet Security
- CORS Protection
- Secure API Routes
- Environment Variables

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Context API
- Framer Motion
- React Icons
- Chart.js

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Helmet
- Morgan
- CORS

---

# 📁 Project Structure

```
Royal-Task-Manager-MERN
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/NANIPRABHAS1302/Royal-Task-Manager-MERN.git
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/royal-task-manager

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- PUT `/api/auth/profile`
- PUT `/api/auth/change-password`
- POST `/api/auth/forgot-password`
- PUT `/api/auth/reset-password/:token`

---

## Tasks

- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- PATCH `/api/tasks/:id/toggle`
- GET `/api/tasks/dashboard/stats`

---

## Categories

- GET `/api/categories`
- POST `/api/categories`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`

---

# 📱 Responsive Design

Optimized for

- Desktop
- Laptop
- Tablet
- Mobile

---

# 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Task Management
- Statistics
- Dark Mode
- Mobile View

---

# 🔮 Future Improvements

- Email Notifications
- Calendar Integration
- Task Reminders
- Team Collaboration
- File Attachments
- Real-time Updates
- PWA Support
- Docker Deployment

---

# 👨‍💻 Developer

**NANI PRABHAS**

GitHub:

https://github.com/NANIPRABHAS1302

---

# 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

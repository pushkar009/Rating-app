# ⭐ Store Rating Platform

A full-stack web application that enables users to rate stores, manage accounts, and interact with a role-based dashboard system. Built with React, Node.js/Express, and PostgreSQL, this project demonstrates practical implementation of authentication, role-based authorization, database modeling, and dynamic UI rendering.

🚀 Features

The platform supports three user roles with dedicated functionalities:

## 👑 1. System Administrator
### Dashboard Overview
The admin dashboard displays:
 * 📌 Total number of users
 * 🏬 Total number of stores
 * ⭐ Total number of submitted ratings

### Admin Capabilities
➕ Add new:
  1. Admin users
  2. Store owners
  3. Normal users Stores

### 📋 View full list of:
 * Stores (Name, Email, Address, Rating) 
 * Users (Name, Email, Address, Role)

### 🔍 Apply filters on:
 * Name
 * Email
 * Address
 * Role
 
### 🚪 Logout

## 🙋 2. Normal User
### Authentication
* 📝 Can sign up
* 🔑 Can log in

### Signup Form Requirements
* Name
* Email
* Address
* Password

### User Capabilities
* 🔒 Update password
* 🏬 View all registered stores
* 🔍 Search stores by:
  1. Name
  2. Address

### ⭐ Store listings display:
 * Store Name
 * Address
 * Overall Rating
 * User’s own rating (if submitted)
 * Button to submit rating
 * Submit/Modify ratings (1–5 stars)

### 🚪 Logout

## 🏪 3. Store Owner
### Owner Dashboard

Store owners can:
* 👥 View list of users who rated their store
* ⭐ See their store’s average rating
* 🔒 Update password
* 🚪 Logout

## ⚙️ Form Validations
All form fields follow strict validation rules:

| Field | Validation |
|------|-----------|
| Name | 20–60 characters |
| Address	| Max 400 characters |
| Password | 8–16 characters, must include one uppercase letter and one special character |
| Email	| Must follow valid email format |

## 🗄️ Database Design (PostgreSQL)
* Tables
* users
* stores
* ratings

### Highlights:
* Store name is used as a foreign key reference in ratings
* A store may have multiple ratings
* User may submit only one rating per store (editable)

## 🧠 Tech Stack
### Frontend
* React
* Axios
* PrimeReact
* React Icons

### Backend
* Node.js
* Express.js
* JSON Web Tokens (JWT)
* bcrypt

### Database
* PostgreSQL

## 🔐 Authentication & Security
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes via middleware
* Role-based access control

## 📦 Project Structure
```pgsql
Rating-app/
│── frontend/     → React application
│── backend/      → Express server + PostgreSQL
│── README.md
```

## ▶️ How to Run Locally
1. Clone the repository: 
`git clone https://github.com/pushkar009/Rating-app.git`

2. 🔧 Backend Setup (Install dependencies): 
```
cd backend
npm install
```

3. Create a .env file
```env
DATABASE_URL=your_postgresql_url_here
JWT_SECRET=your_secret_key
```

4. Start server
`npm start`

🎨 Frontend Setup
5. Install dependencies
```
cd ../frontend
npm install
```

6. Start frontend
`npm run dev`

## 🌐 Deployment 

| Frontend | Backend | database |
|---|---|---|
| Vercel (Frontend) | Render (Node Server) | Supabase (Hosted PostgreSQL) |

## 📈 Outcomes
This project includes:

* Role-based UI rendering
* Secure login system with JWT
* Real-time store ratings
* Interactive dashboards
* Fully responsive UI
* Sorting, filtering, and user management
* Database schema with relational structure

## 🤝 Contributing
Contributions, suggestions, and improvements are welcome!
Feel free to open issues or submit PRs.

## 📜 License
This project is licensed under the MIT License.

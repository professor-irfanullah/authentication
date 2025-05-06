# 🔐 User Authentication API

A Node.js and Express-based backend API for user authentication, featuring secure password hashing, JWT-based sessions, cookies, MySQL database integration, and email notifications with Nodemailer.

---

## 🚀 Features

- ✅ User registration and login
- 🔒 Password hashing using **bcrypt**
- 🔐 JSON Web Tokens (JWT) for authentication
- 🍪 Session handling with **HTTP-only cookies**
- 📧 Email support using **Nodemailer**
- 🧮 MySQL2 for database integration
- 🛡️ Environment-based configuration with `.env`

---

## 📁 Tech Stack

- **Node.js**
- **Express**
- **MySQL2**
- **bcrypt**
- **jsonwebtoken**
- **cookie-parser**
- **dotenv**
- **Nodemailer**

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## 🗄️ Database Setup (MySQL)

This project uses a MySQL database. You’ll need to create the database and table before running the app.

### 📋 Database Name:

`your_database_name` (as defined in your `.env` file)

### 📂 Table: `users`

| Column               | Type         | Attributes                             |
| -------------------- | ------------ | -------------------------------------- |
| `user_id`            | INT          | Primary Key, Auto Increment            |
| `name`               | VARCHAR(255) | NOT NULL                               |
| `email`              | VARCHAR(255) | UNIQUE, NOT NULL                       |
| `password`           | VARCHAR(255) | Hashed with bcrypt, NOT NULL           |
| `created_at`         | TIMESTAMP    | Default: CURRENT_TIMESTAMP             |
| `updated_at`         | TIMESTAMP    | Default: CURRENT_TIMESTAMP on update   |
| `is_verified`        | BOOLEAN      | Default: FALSE                         |
| `verification_token` | VARCHAR(255) | Nullable (used for email verification) |

### 🛠️ SQL Schema Example

````sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255)
);
---

## 📌 API Endpoints

All endpoints are prefixed with `/api/auth`

### 🔐 Public Routes

#### 📥 `POST /api/auth/register`
Registers a new user.

- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourPassword123"
  }
````

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

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL default 'seeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255)
);
```

# API Documentation

This document provides details about the available API endpoints for the application.

## Base URL

`http://localhost:3000/api`

## Authentication Endpoints

### Register a new user

**Endpoint:** `/auth/register`
**Method:** `POST`
**Content-Type:** `application/json`
**Request Body:**

```json
{
  "user_name": "name",
  "email": "test@test.com",
  "password": "test"
}
```

## Description: Creates a new user account with the provided details.

### Verify email

**Endpoint:** `/auth/verify`
**Method**: `GET`
Query Parameters:

```js
{
token: Verification token
email: User's email address
}
```

## Description: Verifies a user's email address using the token sent to their email.

### Login

**Endpoint:** `/auth/login`
**Method:** `POST`
**Content-Type:** `application/json`
Request Body:

```json
{
  "email": "test@gmail.com",
  "password": "test"
}
```

## Description: Authenticates a user and returns an access token.

### Protected route

**Endpoint:** `/auth/protected`
**Method:** `POST`
**Content-Type:** `application/json`
Description: A protected route that requires authentication.

---

### Test Endpoint

**Test API connection**
**Endpoint:** `/test`
**Method:** `GET`
Description: A simple endpoint to test if the API is running.

---

### Account status check

**Endpoint:** `/accountStatus`
**Method:** `GET`
**Query Paramater with Example:**

```text
/api/auth/accountStatus?email=test@test.test
```

## Description: An email is required here in order to check the status of the account from the DB

### Usage Notes

```text
All authentication endpoints require proper headers and request bodies as shown.

The protected route requires a valid JWT token in the Authorization header.

After registration, users will receive an email with a verification link.

Example Responses
Successful login returns a JWT token in the format:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Error Handling
All endpoints return appropriate HTTP status codes with error messages in the response body when something goes wrong.

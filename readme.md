# 💼 JobBoard Website

A full-featured backend for a job board web application built with Node.js and Express. This project supports secure user authentication, user role-based access (seeker/employee), profile management, and resume-building features — with PostgreSQL integration and email verification using Nodemailer.

---

## 🚀 Features

- ✅ User registration, email verification, and login
- 🧑‍💼 Role-based access for **Job Seekers** and **Employers**
- 📄 Seeker profile creation, education, and skill management
- 🔒 Password hashing using **bcrypt**
- 🔐 JWT-based authentication for protected routes
- 🍪 Session handling with **HTTP-only cookies**
- 📧 Email notifications via **Nodemailer**
- 🧮 PostgreSQL database integration with **pg**
- ⚙️ Environment-based configuration using `.env`

---

## 📁 Tech Stack

- **Node.js**
- **Express**
- **pg**
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

## 🗄️ Database Setup (PostgreSql)

This project uses a PostgreSql database. You’ll need to create the database and table before running the app.

### 📋 Database Name:

`your_database_name` (as defined in your `.env` file)

### 📂 Table: `users`

| Column               | Type                      | Attributes                             |
| -------------------- | ------------------------- | -------------------------------------- |
| `user_id`            | INT                       | SERIAL ,Primary Key                    |
| `name`               | VARCHAR(255)              | NOT NULL                               |
| `email`              | VARCHAR(255)              | UNIQUE, NOT NULL                       |
| `password`           | VARCHAR(255)              | Hashed with bcrypt, NOT NULL           |
| `created_at`         | TIMESTAMP                 | Default: CURRENT_TIMESTAMP             |
| `updated_at`         | TIMESTAMP                 | Default: CURRENT_TIMESTAMP on update   |
| `is_verified`        | BOOLEAN                   | Default: FALSE                         |
| `verification_token` | VARCHAR(255)              | Nullable (used for email verification) |
| `role`               | enum('seeker , employee') | DEFAULT 'seeker'                       |

### 📂 Table: `seeker_profiles`

| Column         | Type                         | Attributes                                          |
| -------------- | ---------------------------- | --------------------------------------------------- |
| `profile_id`   | INT                          | SERIAL ,Primary Key                                 |
| `user_id`      | INT,                         | NOT NULL, REFRENCES(USER_USER_ID) ON DELETE CASCADE |
| `headline`     | VARCHAR(255)                 | NOT NULL                                            |
| `bio`          | TEXT                         | NOT NULL                                            |
| `location`     | VARCHAR(255)                 | NOT NULL                                            |
| `linkedin_url` | VARCHAR(255)                 | NOT NULL                                            |
| `github_url`   | VARCHAR(255)                 | NOT NULL                                            |
| `is_public`    | ENUM('private' , 'public') , | DEFAULT('private')                                  |
| `created_at`   | TIMESTAMP                    | DEFAULT CURRENT_TIMESTAMP                           |
| `updated_at`   | TIMESTAMP                    | DEFAULT CURRENT_TIMESTAMP                           |

### 📂 Table: `seeker_education`

| Column           | Type         | Attributes                                            |
| ---------------- | ------------ | ----------------------------------------------------- |
| `education_id`   | INT          | SERIAL, Primary Key                                   |
| `user_id`        | INT          | NOT NULL, REFERENCES(users.user_id) ON DELETE CASCADE |
| `institution`    | VARCHAR(255) | NOT NULL                                              |
| `degree`         | VARCHAR(100) | NOT NULL                                              |
| `field_of_study` | VARCHAR(100) | NOT NULL                                              |
| `start_date`     | DATE         | NOT NULL                                              |
| `end_date`       | DATE         | NULLABLE                                              |
| `created_at`     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                             |

### 📂 Table: `seeker_skills`

| Column                | Type                                     | Attributes                                            |
| --------------------- | ---------------------------------------- | ----------------------------------------------------- |
| `skill_id`            | INT                                      | SERIAL, Primary Key                                   |
| `user_id`             | INT                                      | NOT NULL, REFERENCES(users.user_id) ON DELETE CASCADE |
| `skill_name`          | VARCHAR(100)                             | NOT NULL                                              |
| `proficiency_level`   | ENUM('beginner','intermediate','expert') | NOT NULL                                              |
| `years_of_experience` | INT                                      | DEFAULT 0                                             |
| `created_at`          | TIMESTAMP                                | DEFAULT CURRENT_TIMESTAMP                             |

---

### 🛠️ SQL Schema for users

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

### 🛠️ SQL Schema for seeker_profiles

```sql
CREATE TABLE seeker_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    headline VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    phone VARCHAR(20),
    linkedin_url TEXT,
    github_url TEXT,
    visibility VARCHAR(20) DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 🛠️ SQL Schema for seeker_education

```sql
CREATE TABLE seeker_education (
    education_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🛠️ SQL Schema for seeker_skills

```sql
CREATE TABLE seeker_skills (
    skill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
    years_of_experience INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

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

<!-- ### Usage Notes

```text
All authentication endpoints require proper headers and request bodies as shown.

The protected route requires a valid JWT token in the Authorization header.

After registration, users will receive an email with a verification link.

Example Responses
Successful login returns a JWT token in the format:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Error Handling
All endpoints return appropriate HTTP status codes with error messages in the response body when something goes wrong. -->

---

## 👤 Seeker-Specific Endpoints

These endpoints are restricted to users with the `seeker` role. They allow a job seeker to manage profile information, education, skills, and personal settings.

---

### 🔐 Authorized Seeker Route

**Endpoint:** `/seeker/authorized_seekers_route`  
**Method:** `POST`

Used internally to verify whether the current user is an authorized seeker.

---

### 📝 Add Profile Information

**Endpoint:** `/seeker/insert/profile/record`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "headline": "Full stack web developer",
  "bio": "I am a full stack web developer",
  "location": "Barikot",
  "linkedin_url": "https://linkedin.com/in/your-profile",
  "github_url": "https://github.com/your-profile"
}
```

---

### 📊 Get Profile Completion Percentage

**Endpoint:** `/seeker/get/profile/comp/percentage`
**Method:** `GET`

Returns a percentage (0–100%) indicating how complete the user's profile is.

---

### ✏️ Update Name & Visibility

**Endpoint:** `/seeker/update/profile/name/visibility`
**Method:** `POST`
**Content-Type:** `application/json`

**Request Body:**

```
{
  "profile": {
    "name": "Irfan Ullah",
    "visibility": "private"
  }
}
```

---

## 🎓 Education Management

### ➕ Add Education Record

**Endpoint:** `/seeker/insert/education/record`
**Method:** `POST`
**Content-Type:** `application/json`

```
{
  "institution": "University of Swat",
  "degree": "BS",
  "field_of_study": "Information",
  "start_date": "2022-05-17",
  "end_date": "2026-05-22"
}
```

---

### ❌ Delete Education Record

**Endpoint:** `/seeker/delete/education/record`
**Method:** `GET`
**Query Parameter:** `education_id`

```
/seeker/delete/education/record?education_id=123
```

---

### 📚 Fetch Education Records

**Endpoint:** `/seeker/get/education/record`
**Method**: `GET`

## 🛠️ Skill Management

### ➕ Add Skill

**Endpoint:** `/seeker/insert/skill/record`
**Method:** `POST`
**Content-Type:** `application/json`

**Request Body:**

```
{
  "skill_name": "C++",
  "proficiency_level": "expert", // Accepts: beginner, intermediate, expert
  "years_of_experience": 4
}
```

---

### ❌ Delete Skill

**Endpoint:** /seeker/delete/skill/record
**Method:** GET
**Query Parameter:** skill_id

```
/seeker/delete/skill/record?skill_id=78
```

---

### 📋 Get Skill Records

**Endpoint:** `/seeker/get/skill/record`
**Method:** `GET`

### 👤 Get Full Seeker Profile

**Endpoint:** `/seeker/profile-info`
**Method:** `GET`

Returns the full profile data for the logged-in seeker.

---

### 🔁 Change Password

**Endpoint:** `/auth/change/password`
**Method:** `POST`
**Content-Type:** `application/json`

**Request Body:**

```
{
  "current": "old_password",
  "newPas": "new_password",
  "confirm": "new_password"
}
```

---

## 🌐 Production Deployment (Railway)

The API is deployed to Railway. You can access the production instance via:

```
https://authentication-production-18e1.up.railway.app
```

---

### 🔐 Example (Railway) - Login

```
POST https://authentication-production-18e1.up.railway.app/api/auth/login
```

**Content-Type:** `application/json`

```
{
  "email": "irfanprofessor60@gmail.com",
  "password": "irfan"
}
```

---

### 🔍 Example - Account Status Check (Railway)

```
GET https://authentication-production-18e1.up.railway.app/api/auth/accountStatus?email=irfanprofessor60@gmail.com
```

---

# 🎮 Gaming Hub — Full-Stack Quiz Platform

A modern, responsive **full-stack quiz application** built with **React.js, Node.js, Express.js, MongoDB, and JWT authentication**.

Gaming Hub allows users to create accounts, log in securely, choose quiz categories and levels, answer questions, track their progress, view scores, and compete through a leaderboard.

The project demonstrates how a complete full-stack application works from the **frontend UI → REST API → authentication → business logic → MongoDB database**.

---
## 🚀 Live Project

🔗 **[View Gaming Hub Live](YOUR_LIVE_PROJECT_URL)**

**GitHub Repository:**
https://github.com/megha-kundu/gaming-hub

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password handling on the backend
* Protected API routes
* Token-based user verification
* Login and signup interfaces
* Authentication state management

### 🎯 Quiz System

* Multiple quiz categories
* Different difficulty/level selections
* Interactive quiz interface
* Dynamic question loading
* Answer selection
* Score calculation
* Quiz completion flow
* Reward/result screen

### 📊 Progress Tracking

* Track user quiz progress
* Store completed quiz information
* Save scores in MongoDB
* Retrieve user progress through APIs
* Maintain user-specific data

### 🏆 Leaderboard

* Display player scores
* Compare performance between users
* Dynamically retrieve leaderboard information from the backend

### 🗄️ Database Integration

MongoDB is used to store application data such as:

* Users
* Questions
* Scores
* Progress

Mongoose models are used to structure and interact with the MongoDB collections.

### 🎨 User Interface

* Modern gaming-inspired interface
* Responsive design
* Reusable React components
* Category selection interface
* Level selection interface
* Interactive quiz screen
* Login/signup pages
* Score and reward screens
* Leaderboard interface

---

## 🛠️ Technology Stack

### Frontend

* **React.js**
* **JavaScript (ES6+)**
* **HTML5**
* **CSS3**
* **Vite**

### Backend

* **Node.js**
* **Express.js**
* **RESTful APIs**
* **JWT / JSON Web Token**
* **Mongoose**

### Database

* **MongoDB**
* **MongoDB Atlas**

### Development Tools

* **VS Code**
* **Git**
* **GitHub**
* **npm**

---

## 🏗️ Project Architecture

The application follows a frontend-backend architecture:

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │    Express.js API     │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             Authentication          Business Logic
                 JWT                       │
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │       MongoDB        │
                              │       Database       │
                              └──────────────────────┘
```



## 🔄 How the Application Works

### 1. User Registration

A new user creates an account through the signup page.

The frontend sends the registration data to the backend API.

```text
Signup Page
     ↓
React Request
     ↓
Express Route
     ↓
Authentication Controller
     ↓
MongoDB
```

---

### 2. User Login

When an existing user logs in:

```text
Login Form
    ↓
POST Authentication Request
    ↓
Express Backend
    ↓
User Verification
    ↓
JWT Token Generated
    ↓
Frontend Receives Token
```

The JWT token is then used when accessing protected resources.

---

### 3. Quiz Selection

The user selects:

```text
Category
   ↓
Difficulty / Level
   ↓
Quiz
```

The frontend requests the appropriate questions from the backend.

---

### 4. Question Retrieval

The question API communicates with MongoDB and returns the required quiz questions.

```text
React Quiz
    ↓
Question API
    ↓
Express Route
    ↓
Question Controller
    ↓
Question Model
    ↓
MongoDB
```

---

### 5. Score Calculation

After completing a quiz, the application calculates the user's result and sends the score to the backend.

The backend stores the score in MongoDB.

```text
Quiz Answers
     ↓
Score Calculation
     ↓
Score API
     ↓
Score Controller
     ↓
Score Model
     ↓
MongoDB
```

---

### 6. Progress Tracking

User progress is stored separately so the application can retrieve information about completed quizzes and performance.

---

### 7. Leaderboard

The leaderboard retrieves stored scores and displays player performance.

```text
MongoDB Scores
      ↓
Score API
      ↓
React Leaderboard
      ↓
Player Rankings
```

---

# 🔐 JWT Authentication

Gaming Hub uses **JSON Web Tokens (JWT)** for authentication.

After successful login, the backend generates a token using a secure environment variable.

---

# 🗃️ MongoDB Models

The backend uses separate models for different types of application data.

### User Model

Stores user account information.

```text
User
├── username
├── password
└── authentication data
```

### Question Model

Stores quiz questions and their related information.

```text
Question
├── question
├── options
├── answer
├── category
└── level
```

### Score Model

Stores quiz performance.

```text
Score
├── user
├── score
├── category
└── quiz information
```

### Progress Model

Stores information about the user's quiz progress.

```text
Progress
├── user
├── completed quizzes
└── progress information
```

---

# 🌐 REST API

The backend is organized using RESTful API routes.

### Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
```

### Questions

```text
GET    /api/questions
```

### Progress

```text
GET    /api/progress
POST   /api/progress
```

### Scores

```text
GET    /api/scores
POST   /api/scores
```

> Exact endpoint paths may vary depending on the deployed configuration.

---

# 🧠 Backend Architecture

The backend follows a controller-route-model structure.

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Model
   ↓
MongoDB
   ↓
Response
```

### Routes

Routes define the API endpoints and determine which controller should handle each request.

### Controllers

Controllers contain the application's business logic.

### Models

Models define how application data is structured and interact with MongoDB.

This separation makes the backend easier to maintain and extend.

---

# 🧪 Development Workflow

The typical development workflow is:

```text
Build UI
   ↓
Create React components
   ↓
Create API requests
   ↓
Build Express routes
   ↓
Implement controllers
   ↓
Connect MongoDB
   ↓
Add authentication
   ↓
Test APIs
   ↓
Debug
   ↓
Deploy
```

# 📱 Responsive Design

The frontend is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The interface uses responsive CSS techniques to adapt layouts to different screen sizes.

---

# 🐛 Debugging & Problem Solving

During development and deployment, the application can involve issues across multiple layers:

```text
Frontend
   ↓
API Request
   ↓
Backend
   ↓
Database
```

Debugging therefore involves checking:

* Browser console
* Network requests
* API responses
* Express server logs
* MongoDB connection
* Environment variables
* Deployment configuration

This project provided practical experience in identifying and resolving issues across a full-stack application.

---

# 🚀 Future Improvements

Possible future enhancements include:

* Google/GitHub OAuth authentication
* Timer-based quizzes
* More quiz categories
* Question randomization
* User profile customization
* Achievement badges
* Daily challenges
* Advanced leaderboard filtering
* Admin dashboard
* Question management system
* Pagination
* Improved analytics
* Dark/light theme
* Multiplayer quiz mode

---

# 🎯 What I Learned

Building Gaming Hub helped me strengthen my understanding of:

* React component architecture
* React state management
* REST API integration
* Node.js and Express.js
* MongoDB and Mongoose
* JWT authentication
* Protected API routes
* CRUD operations
* Database relationships
* Backend controllers and routes
* API error handling
* Frontend-backend communication
* Environment variables
* Git and GitHub
* Debugging
* Full-stack project structure
* Deployment and production troubleshooting

---

# 👩‍💻 Developer

**Megha Kundu**

Full Stack Web Developer

### Skills demonstrated in this project

**Frontend:**
React.js • JavaScript • HTML5 • CSS3 • Vite

**Backend:**
Node.js • Express.js • REST APIs • JWT

**Database:**
MongoDB • Mongoose • MongoDB Atlas

**Tools:**
Git • GitHub • VS Code • npm

---

## ⭐ Project Highlights

> **Gaming Hub demonstrates a complete full-stack workflow — from building an interactive React interface to developing REST APIs, implementing JWT authentication, connecting MongoDB, storing user progress and scores, and presenting the resulting data through the frontend.**

---

## 📄 License

This project is created for learning and portfolio purposes.

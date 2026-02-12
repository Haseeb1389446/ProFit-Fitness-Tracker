# Fitness Tracker

A full-stack fitness tracking application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features
-   **User Authentication**: Register and login securely with JWT.
-   **Dashboard**: View workout statistics and recent activity.
-   **Workout Management**: Log new workouts (activity, duration, calories, notes) and track history.
-   **Modern UI**: Responsive design with dark mode aesthetics and glassmorphism effects.

## Prerequisites
-   [Node.js](https://nodejs.org/) installed.
-   [MongoDB](https://www.mongodb.com/) running locally on port 27017.

## Installation & Setup

1.  **Clone or Download** the repository.
2.  **Install Dependencies** for both server and client:

    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Variables**:
    ensure `server/.env` exists with:
    ```
    MONGO_URI=mongodb://localhost:27017/fitness_tracker
    PORT=5000
    JWT_SECRET=your_secret_key
    ```

## Running the Application

You need to run both the backend server and frontend client simultaneously.

1.  **Start Backend Server**:
    In a terminal:
    ```bash
    cd server
    npm run dev
    ```
    (Runs on `http://localhost:5000`)

2.  **Start Frontend Client**:
    In a *new* terminal:
    ```bash
    cd client
    npm run dev
    ```
    (Runs on `http://localhost:5173`)

## Usage
-   Open your browser to `http://localhost:5173`.
-   Register a new account or login.
-   Start logging your workouts!

# ProFit - Ultimate Fitness & Nutrition Tracker

A comprehensive, full-stack application for managing workouts, tracking nutrition, monitoring physical progress, and achieving your fitness goals.

## 🚀 Features

### User Management
* **Secure Authentication:** User registration and login utilizing JWTs and bcrypt for password hashing.
* **Profiles:** Personalized user profiles with customizable information (bio, location, work) and profile pictures.

### Fitness & Activity Tracking
* **Detailed Workouts:** Log workouts with specific exercises, sets, reps, weights, duration, categories (Strength, Cardio, etc.), and calories burned.
* **Nutrition Logs:** Track daily food intake separated by meal type (Breakfast, Lunch, Dinner, Snack). Records calories, protein, carbs, and fat.
* **Progress Tracking:** Monitor weight changes and body measurements (chest, waist, hips, biceps) over time.

### Insights & Dashboard
* **Interactive Dashboard:** A centralized view of today's activities.
* **Data Visualization:** Integrated Recharts provide dynamic graphs for weight progress, a calorie-burned-vs-consumed chart, and personalized macronutrient distribution pie charts.
* **Search & Filters:** Real-time search and date filtering for workout histories and nutrition logs.

### Advanced Capabilities
* **System Notifications:** An automated notification system that alerts users upon successfully logging workouts, updating progress, and completing meals.
* **PDF Reports:** Generate and download customized, exportable PDF performance reports (Workouts, Nutrition, Progress) filtered by date range.
* **Settings & Preferences:** Easily configurable preferences including Theme (Light/Dark mode), Unit System (Metric/Imperial), and Privacy controls.
* **Support System:** Built-in ticketing system for user support and feedback.

## 💻 Tech Stack

**Frontend:**
* React.js
* Tailwind CSS (Styling & Responsive Design)
* Lucide React (Icons)
* Recharts (Data Visualization)
* jsPDF & jspdf-autotable (Report Generation)
* Axios (HTTP Client)

**Backend:**
* Node.js
* Express.js (REST API)
* MongoDB & Mongoose (NoSQL Database)
* JSON Web Tokens (JWT) for authentication
* Multer (File Uploads)
* bcryptjs (Password encryption)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fitness_tracker
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   * Create a `.env` file in the `server` directory and add your environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   * Run the server:
     ```bash
     npm start
     # or for development:
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   ```
   * Run the React application:
     ```bash
     npm run dev
     ```

## 🌐 API Endpoints

### Authentication (`/api/auth`)
* `POST /register` - Register a new user
* `POST /login` - Login user and return JWT
* `GET /me` - Get logged-in user profile

### Users (`/api/users`)
* `PUT /profile` - Update user profile information

### Workouts (`/api/workouts`)
* `GET /` - Get user's workouts (supports ?search, ?category, ?startDate, ?endDate)
* `POST /` - Add a new workout log
* `DELETE /:id` - Delete a workout log

### Nutrition (`/api/nutrition`)
* `GET /` - Get user's nutrition logs (supports ?search, ?startDate, ?endDate)
* `POST /` - Add a new nutrition log
* `DELETE /:id` - Delete a nutrition log

### Progress (`/api/progress`)
* `GET /` - Get user's progress logs
* `POST /` - Add a new progress log (supports image uploads)

### Notifications (`/api/notifications`)
* `GET /` - Get user's notifications
* `PUT /:id/read` - Mark a notification as read
* `DELETE /:id` - Delete a notification

### Support (`/api/support`)
* `POST /` - Submit a new support ticket

## 📱 Mobile Responsiveness
ProFit has been built with a fully responsive layout ensuring a seamless user experience on desktops, tablets, and smartphones.

## 👨‍💻 Contributing
Feel free to open an issue or submit a pull request if you'd like to contribute to ProFit!

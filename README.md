<<<<<<< HEAD
<<<<<<< HEAD
# Mini Project Management Portal

A full-stack, responsive, and feature-rich project management portal designed to streamline task tracking. It features dynamic sorting, filtering, title-based search, pagination, dark-mode toggle, real-time validations, and automatic database setup with seeding.

---

## Technical Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router DOM, Lucide Icons
- **Backend:** Node.js, Express.js, MySQL (promise-based connection pool), CORS, Dotenv, Nodemon
- **Database:** MySQL

---

## Features
1. **Interactive Dashboard:** Shows real-time tasks sorted by latest additions in modern card forms.
2. **Dashboard Statistics Cards:** Live count totals for All, Pending, In Progress, and Completed tasks.
3. **Advanced Filters & Search:** Filter dynamically by Status (All, Pending, In Progress, Completed), search by task Title, and sort by Newest or Oldest first.
4. **Pagination:** Displays 5 tasks per page with responsive back/next pagination controls.
5. **Stateful Add Task Page:** Simple creation forms containing real-time input validations (Title: required, Description: >= 20 characters) and live success toasts.
6. **Task Actions:** Mark tasks as "Completed" dynamically, or "Delete" tasks with a warning overlay.
7. **Premium UI/UX:** Responsive mobile-first grid, dark mode toggler, smooth animations, glassmorphism overlays, custom scrollbars, loading states, and custom empty board placeholders.

---

## Folder Structure

```text
o2h full stack/
├── backend/
│   ├── config/
│   │   └── db.js            # DB connection & auto-migration/seeding
│   ├── controllers/
│   │   └── taskController.js# API handlers (validations & errors)
│   ├── models/
│   │   └── taskModel.js     # Parameterized SQL queries
│   ├── routes/
│   │   └── taskRoutes.js    # Express route mappings
│   ├── .env                 # Server config & DB secrets
│   ├── package.json         # Backend node scripts & packages
│   └── server.js            # Express bootstrap, CORS & error handlers
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DeleteConfirmationModal.jsx # Destructive alert overlay
    │   │   ├── EmptyState.jsx              # Search fallback visual
    │   │   ├── Loading.jsx                 # Glassmorphic spinner
    │   │   ├── Navbar.jsx                  # Header + animated dark mode
    │   │   ├── TaskCard.jsx                # Info card + inline actions
    │   │   ├── TaskFilter.jsx              # Debounced search & filter bar
    │   │   └── Toast.jsx                   # Global custom toast alert system
    │   ├── pages/
    │   │   ├── AddTask.jsx                 # Validation form layout
    │   │   └── Dashboard.jsx               # Stat cards + task list grid
    │   ├── services/
    │   │   └── api.js                      # Axios middleware client
    │   ├── App.jsx                         # React routing & dark mode sync
    │   └── index.css                       # Google fonts + Tailwind styles
    ├── index.html                          # Meta configs & page header
    ├── postcss.config.js                   # Styles build setup
    ├── tailwind.config.js                  # Theme definitions & dark class
    └── package.json                        # Frontend packages config
```

---

## Installation & Setup

### 1. MySQL Setup
Ensure you have MySQL installed and running. Create a connection and verify that your credentials (user, password, host, port) align with the configs inside `backend/.env`.

The backend automatically runs the following script to initialize the database and tables, and seeds mock tasks if none exist:
```sql
CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your environmental variables in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=project_db
   DB_PORT=3306
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server in hot-reload development mode:
   ```bash
   npm run dev
   ```
   *The server runs at: `http://localhost:5000`*

### 3. Frontend Installation
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
   *The client app runs at: `http://localhost:5173`*

---

## API Endpoints

| Method | Endpoint | Description | Query Parameters / Body |
|:---|:---|:---|:---|
| **GET** | `/tasks` | Get paginated tasks + stats | `?search=...&status=...&sort=newest/oldest&page=1&limit=5` |
| **POST** | `/tasks` | Create a new task | Body: `{ "title": "...", "description": "...", "status": "Pending" }` |
| **PUT** | `/tasks/:id` | Update a task's status | Body: `{ "status": "Completed" }` |
| **DELETE** | `/tasks/:id` | Delete a task | Parameter: `id` |

---

## Development Assumptions
- **Database Initialization:** The backend connection pool auto-creates the database (`project_db`) and table (`tasks`) if they do not exist.
- **Mock Seeding:** When the tasks table contains zero rows, the database automatically injects 5 realistic tasks so that the sorting, filters, search, and pagination are visible immediately.
- **Port Clashes:** The backend runs on Port `5000` and the frontend runs on Port `5173` (Vite's default).
- **Dark Mode Syncing:** Dark mode theme choices are persisted in the browser's `localStorage` and will survive page reloads.
=======
# full-stack
>>>>>>> 8d2901a8062422a4b9525b08f448ff189422eab8
=======
# 02h-developer
>>>>>>> ce9b6048ac465fae5119a56eed7263863acb9aab

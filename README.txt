# Retro Personnel Management System

A Windows 95-styled web application for managing employee records, built with Node.js, Express, MongoDB, and React.

## 💻 Software Information
- **Version:** 1.0.0
- **System:** RetroSys
- **Backend:** Node.js + Express + MongoDB (ESM)
- **Frontend:** React + TailwindCSS (Vite)
- **Default User:** `admin`
- **Default Password:** `password`

## 🛡️ Security & Architecture Notes (For Demo Purposes)

This project is designed as a **local demonstration** of Full Stack CRUD operations and UI design. If you are reviewing this code, please note the following architectural choices:

1.  **Local Database Connection:**
    The application connects to `mongodb://127.0.0.1:27017`. This is secure for a public repository because it points to the *user's local machine*. It does not expose any remote production database credentials.

2.  **Authentication:**
    For ease of demonstration, the "Admin" credentials (`admin` / `password`) are hardcoded in `server.js`. In a real production environment, this logic would be replaced by:
    *   Bcrypt password hashing.
    *   A MongoDB `Users` collection.
    *   Environment variables (`.env`) for secrets.

3.  **Data Privacy:**
    The employee data included in `data/personnel.json` consists entirely of fictional characters (pop culture references) and does not contain real personal information (PII).

## 🚀 Quick Start Guide

To run this application, you must run the **Backend** (API) and the **Frontend** (UI) in two separate terminal windows at the same time.

### 1. Prerequisites
*   **Node.js** (v14+) installed.
*   **MongoDB** installed and running locally on port `27017`.

### 2. Initial Setup
Open your project folder in VS Code.

1.  **Install Dependencies**:
    Open a terminal (`Ctrl` + `` ` ``) and run:
    ```bash
    npm install
    ```

2.  **Seed the Database**:
    Import the default employee list into MongoDB:
    ```bash
    npm run seed:import
    ```

### 3. Running the Application

You need **TWO** terminal terminals open.

#### Terminal 1: The Backend (Server)
This connects to the database and listens for API requests.

1.  Open a terminal.
2.  Run the server:
    ```bash
    npm run server
    ```
    *(Alternatively: `node server.js`)*
3.  **Keep this terminal open.** You should see: `Server started on port 5000`.

#### Terminal 2: The Frontend (Client)
This launches the web browser interface.

1.  Open a **second** terminal (Click the `+` icon in VS Code terminal panel).
2.  Start the React app:
    ```bash
    npm run dev
    ```
3.  Open the link shown in the terminal (usually `http://localhost:5173`).

### 4. Using the App
1.  When the login screen appears, enter:
    *   User: `admin`
    *   Password: `password`
2.  Click **OK**.

---

## 🛠️ Management Commands

**Reset Database:**
If you want to delete all employees and start fresh:
```bash
npm run seed:delete
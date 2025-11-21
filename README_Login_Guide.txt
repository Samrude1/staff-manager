# LEARNING GUIDE: Understanding the Login Architecture

This guide explains how the authentication flow works in the Retro Personnel Manager.  
It follows the data from the moment the user clicks **“OK”** until the dashboard appears.

We are using a standard **Client–Server Architecture**.

---

## 1. The Big Picture (The Flow)

1. **UI Layer (Frontend):** User types credentials and clicks the button.  
2. **Service Layer (Middleman):** The app prepares an HTTP request and sends it across the network.  
3. **API Layer (Backend):** The server receives the request, checks the credentials, and decides if access is allowed.  
4. **Response:** The server sends back either success or failure, and the frontend updates accordingly.

---

## 2. Deep Dive by File

### A. The User Interface (`App.tsx`)
**Role:** The Face. Handles user input and visual updates.

When you click “OK”, the function `handleLoginSubmit` runs:
- It prevents the page from reloading (`e.preventDefault()`).
- It calls the `login()` function from the service file.
- It waits (`await`) for the server’s answer.
  - If valid, it sets `setIsAuthenticated(true)` and shows the dashboard.
  - If invalid, it shows a red alert box with an error message.

### B. The Service Layer (`services/authService.ts` or inside `employeeService.ts`)
**Role:** The Messenger. Abstracts HTTP details away from React components.

Why have this file?
- **Separation of Concerns:** Components focus on rendering UI, not network details.  
- **Reusability:** The same login function can be reused elsewhere.

**The Logic:**
1. Uses `fetch` to send a request.  
2. `method: 'POST'` because credentials are sent in the request body.  
3. `JSON.stringify` converts `{ username, password }` into a text string for transport.  
4. Checks `response.ok`. If the server replies with 401 (Unauthorized) or 500 (Error), it throws an error.

### C. The Backend (`server.js`)
**Role:** The Brain. Makes the final decision.

**The Logic:**
1. `app.post("/api/login", ...)` listens for POST requests at `/api/login`.  
2. `req.body` reads the JSON data sent by the frontend.  
3. **Verification:** Compares input against stored credentials (currently hardcoded).  
   - **Security Note:** Previously this check was in `App.tsx`, which exposed the password in client code.  
   - Now the check is hidden in the server, so users cannot see it.  
4. **Response (`res.json`)**:  
   - **Success:** Sends status 200 and `{ success: true }`.  
   - **Failure:** Sends status 401 and `{ success: false, message: "Invalid credentials" }`.

---

## 3. Why did we change it?

**Old Way (Client‑Side Auth):**
- Logic: `if (input === "password") showApp()` inside `App.tsx`.  
- Risk: Anyone could open DevTools and see the password.

**New Way (Server‑Side Auth):**
- Logic: App sends credentials → Server checks → Server replies.  
- Benefit: Authentication logic is hidden on the server.  
- Scalability: Later you can replace the hardcoded check with a MongoDB lookup (`User.findOne(...)`) without changing the frontend.

---

## 4. Summary of the Code Chain

1. **App.tsx**: `await login(user, pass)`  
   ↓ calls  
2. **authService.ts**: `fetch('/api/login', body)`  
   ↓ sends request  
3. **server.js**: `app.post('/api/login')` → checks credentials → `res.json({ success: true })`  
   ↓ returns response  
4. **authService.ts**: Receives JSON → returns result  
   ↓  
5. **App.tsx**: Sets `isAuthenticated(true)` → User sees the Retro Dashboard.

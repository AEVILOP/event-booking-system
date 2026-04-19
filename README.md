# Event Booking System API

A secure, role-based backend REST API for managing event creation, browsing, and ticketing. Built entirely using Node.js and Express.js.

## 🚀 Features

- **Role-Based Access Control Pattern:** Strict differentiation between `organizer` (creates/manages events) and `customer` (browses/books events) limits.
- **JWT Authentication:** Secure password hashing (via `bcryptjs`) and stateless request validation using JSON Web Tokens.
- **In-Memory Volatile Datastore:** Zero-dependency mock database implementing `schemas` via Javascript objects. Eliminates the need for native driver compilations usually required by SQLite on Windows environments.
- **Internal Async Job Queue:** Implements a decoupled job processing workflow which manages tasks asynchronously. Workloads like sending booking confirmation emails or broadcasting event updates resolve in the background without blocking the express event loop.
- **Concurrency Locks:** Prevents double booking on limited ticket reserves using basic resource locks.

## 🛠 Tech Stack

- **Node.js** & **Express.js** (Core API layer)
- **bcryptjs** (Password cryptography)
- **jsonwebtoken** (Authorization enforcement)
- **dotenv** (Environment management)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AEVILOP/event-booking-system.git
   cd event-booking-system
   ```

2. **Install core dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   Ensure a `.env` file exists at the root of the project to initialize the server configuration:
   ```env
   JWT_SECRET=your_super_secret_key
   ```

4. **Spin up the Server:**
   ```bash
   npm start
   ```
   *(Server defaults to running on port 3000)*

## 🧪 Testing

The repository contains a custom programmatic API verification script (`test.js`). The script performs a full end-to-end (E2E) workflow test without requiring external REST clients like Postman. 

While the server is running, execute:
```bash
node test.js
```
The script will perform: Full registrations -> Token captures -> Event creation -> Ticketing actions -> Event modify triggers. 

## 📂 Project Structure

- **`src/database.js`**: Houses the local runtime database arrays and mock structure logic.
- **`src/middlewares.js`**: Contains reusable authentication and role-authorization verifiers.
- **`src/queue.js`**: The `JobQueue` implementation handling asynchronous post-booking workloads.
- **`src/utils/response.js`**: Utility wrap formatting the API JSON responses seamlessly.
- **`src/routes/`**: Distinct compartmentalized route handlers handling logic scopes for Authentication, Events, and Bookings.

# 🚀 Collab Desk

A real-time collaboration platform built with the MERN stack that allows teams to manage tasks and communicate through live chat — similar to WhatsApp group messaging but organized around tasks.

---

## 📌 Features

* 🔐 User Authentication (Login / Signup)
* 👥 Role-based Access (Admin, Manager, User)
* 📋 Task Management System
* 💬 Real-time Task Chat (Socket.IO)
* 🔔 Live Notifications & Unread Message Count
* 🟢 WhatsApp-style Chat UI
* 📱 Fully Responsive Design
* 🧹 Delete Own Messages

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Bootstrap + Custom CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/collab-desk.git
cd collab-desk
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
PORT=3000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/signup`
* `POST /api/login`

### Tasks

* `GET /api/tasks`
* `POST /api/tasks`

### Messages

* `POST /api/messages`
* `GET /api/messages/:taskId`
* `DELETE /api/messages/:id`

### Unread Count

* `GET /api/unread/:userId`

---

## ⚡ Real-time Events (Socket.IO)

| Event            | Description      |
| ---------------- | ---------------- |
| `joinTask`       | Join a task room |
| `sendMessage`    | Send message     |
| `receiveMessage` | Receive message  |

---

## 📂 Project Structure

```
Collab-Desk/
│
├── backend/
│   ├── Controller/
│   ├── Model/
│   ├── Routes/
│   └── server.js
│
├── frontend/
│   ├── Components/
│   ├── App.jsx
│   └── App.css
```

---

## 🧠 How It Works

* Each task acts like a **chat room**
* Users join rooms using Socket.IO
* Messages are stored in MongoDB
* Real-time updates are pushed to all users in the same task
* Unread messages are tracked per task

---

## 🚀 Future Improvements

* ✅ Message read receipts (✔✔)
* ⌨️ Typing indicator
* 🟢 Online/offline status
* 📎 File & image sharing
* 🔍 Search messages
* 🌐 Deployment (Render / Vercel)

---

## 👨‍💻 Author

**Your Name**

---

## 📄 License

This project is open-source and available under the MIT License.

---

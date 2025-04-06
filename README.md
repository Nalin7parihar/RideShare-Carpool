# 🚗 RideShare - Car Pooling & Ride-Sharing Web Platform

A full-stack MERN-based carpooling platform that connects drivers offering rides and passengers searching for shared travel options. This project emphasizes real-time updates, secure user authentication, and a smooth user experience.

---

## 🔥 Features

### 👥 Authentication & User Roles
- Login/Signup for **Drivers** and **Customers**
- Role-based access control
- JWT authentication (stored in localStorage)

### 🛣 Ride Management (Driver)
- Create rides with:
  - Start location, destination
  - Time, date, price
  - Seats available
- View and manage upcoming rides
- Cancel rides if needed

### 🎟 Ride Booking System (Customer)
- Search available rides by location, date, passengers
- Book seats in real-time
- View all booked rides

### 🔄 Real-Time Updates with WebSockets
- Live notifications for:
  - Ride booking requests
  - Driver reaching pickup
  - Ride start & end updates

### 🚀 Deployment
- **Backend**: Render  
- **Frontend**: Vercel  
- **Database**: MongoDB Atlas  

---

## 🛠 Tech Stack

### 🧠 Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT for auth
- CORS configured

### 🎨 Frontend
- React.js + Vite
- Tailwind CSS
- Redux Toolkit
- React Toastify (notifications)
- Axios for API calls

---

## 🌐 Live URLs

- 🔗 Frontend: [https://rideshare-orcin-eight.vercel.app](https://rideshare-orcin-eight.vercel.app)
- 🔗 Backend: [https://rideshare-carpool.onrender.com](https://rideshare-carpool.onrender.com)

---

## 🚧 Known Limitations

- LocalStorage-based JWT auth (can be improved to HttpOnly cookies)
- Some pages may not be fully functional
- Basic error handling; limited responsiveness on some screens

---

## 📚 Lessons Learned

- Built full-stack MERN app from scratch
- Implemented real-time features with **Socket.IO**
- Gained experience deploying full-stack apps using **Render** and **Vercel**
- Understood backend APIs, MongoDB schemas, and state management in React

---

## 🧑‍💻 Developed By

**Nalin Parihar**  
[GitHub](https://github.com/Nalin7parihar) • [LinkedIn](https://www.linkedin.com/in/nalin-parihar-4905312b6/)

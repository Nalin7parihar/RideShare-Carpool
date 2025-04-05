import express from "express";
import http from "http";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/user.route.js";
import driverRoute from "./routes/driver.route.js";
import ridesRoute from "./routes/rides.route.js";
import bookingRoute from "./routes/booking.route.js";
import socketHandler from "./sockets/socketHandler.js";
import { Server } from "socket.io";
import cors from "cors";
const app = express();

connectDB();
connectCloudinary();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin :  ["http://localhost:5173","https://rideshare-orcin-eight.vercel.app/Auth"],
  credentials : true
}));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/users", userRoute);
app.use("/api/driver", driverRoute);
app.use("/api/rides", ridesRoute);
app.use("/api/bookings", bookingRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://rideshare-carpool.onrender.com",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);
server.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});

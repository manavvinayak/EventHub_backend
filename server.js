import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(
  cors({
     origin: [
    'https://event-hub-frontend-bay.vercel.app/', 
    'http://localhost:3000'  
  ],
    credentials: true, 
  }),
)
app.use(express.json()) // For parsing application/json
app.use(cookieParser()) // For parsing cookies

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/registrations", registrationRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Event Management System API is running!")
})

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js"

dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars)
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

console.log('🚀 Starting EventHub API Server...')
console.log('📊 Environment:', process.env.NODE_ENV || 'development')
console.log('🔧 Port:', PORT)

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully")
    console.log("🔗 Database connection established")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Middleware
const allowedOrigins = [
  // Production Vercel URLs - current
  'https://event-hub-frontend-alpha-three.vercel.app',
  'https://event-hub-frontend-alpha-three.vercel.app/',
  'https://event-hub-frontend-7k0jcyc2w-manavvinayaks-projects.vercel.app',
  'https://event-hub-frontend-7k0jcyc2w-manavvinayaks-projects.vercel.app/',
  // Any Vercel deployment pattern
  /^https:\/\/event-hub-frontend.*\.vercel\.app$/,
  /^https:\/\/.*-manavvinayaks-projects\.vercel\.app$/,
  // Old URL (if still in use)
  'https://event-hub-frontend-bay.vercel.app',
  'https://event-hub-frontend-bay.vercel.app/',
  // Local development
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      // Check exact matches first
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      
      // Check regex patterns
      const isAllowedByPattern = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin)
        }
        return false
      })
      
      if (isAllowedByPattern || process.env.NODE_ENV !== 'production') {
        callback(null, true)
      } else {
        console.log('🚫 Blocked by CORS:', origin)
        console.log('🔍 Allowed origins:', allowedOrigins.filter(o => typeof o === 'string'))
        callback(new Error(`CORS: Origin ${origin} not allowed`))
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
  }),
)

// Handle preflight requests explicitly
app.options('*', cors())
app.use(express.json()) // For parsing application/json
app.use(cookieParser()) // For parsing cookies

// Add request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`📨 ${req.method} ${req.path} - ${timestamp}`)
  console.log(`🌍 Origin: ${req.get('Origin') || 'No origin'}`)
  console.log(`🍪 Cookies: ${req.get('Cookie') ? 'Present' : 'None'}`)
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body keys:', Object.keys(req.body))
  }
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/registrations", registrationRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Event Management System API is running!")
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    message: "API is healthy",
    environment: process.env.NODE_ENV || "development",
    features: {
      signup: "enabled",
      login: "enabled", 
      emailVerification: "disabled",
      registration: "enabled"
    }
  })
})

// Test endpoint for signup functionality
app.post("/api/test/signup", async (req, res) => {
  res.json({
    message: "Signup endpoint is accessible",
    timestamp: new Date().toISOString(),
    receivedData: {
      hasUsername: !!req.body.username,
      hasEmail: !!req.body.email,
      hasPassword: !!req.body.password
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message)
  console.error('📍 Stack:', err.stack)
  console.error('🔗 Request URL:', req.url)
  console.error('📝 Request Method:', req.method)
  
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log("🎉 EventHub API Server is running!")
  console.log(`🌐 Server running on port ${PORT}`)
  console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`)
  console.log("📡 Ready to accept connections...")
})

import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  })
}

const setJwtCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production"
  
  res.cookie("jwt", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: isProduction, // Use secure cookies in production only
    sameSite: isProduction ? "none" : "lax", // Use "lax" for local development
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  })
  
  console.log("Cookie set with options:", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000
  })
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { username, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] })

    if (userExists) {
      return res.status(400).json({ message: "User with that email or username already exists" })
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || "student", // Default to student if not provided
    })

    if (user) {
      const token = generateToken(user._id)
      setJwtCookie(res, token)

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during signup" })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    console.log("Login attempt for email:", email)
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      console.log("Generated token for user:", user._id)
      
      setJwtCookie(res, token)
      console.log("Cookie should be set in response")

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } else {
      console.log("Invalid credentials for email:", email)
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
}

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  })
  res.status(200).json({ message: "Logged out successfully" })
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  }
  res.status(200).json(user)
}

export { signup, login, logout, getProfile }

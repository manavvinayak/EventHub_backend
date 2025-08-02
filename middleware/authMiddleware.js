import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
  let token

  console.log("Auth middleware - full request headers:", req.headers)
  console.log("Auth middleware - cookies:", req.cookies)
  console.log("Auth middleware - cookie header:", req.headers.cookie)
  
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
    console.log("Token found in cookies:", token.substring(0, 20) + "...")
  }

  if (!token) {
    console.log("No token found - sending 401")
    return res.status(401).json({ message: "Not authorized, no token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    console.log("User authenticated:", req.user.username)
    next()
  } catch (error) {
    console.error("Token verification failed:", error)
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `User role ${req.user ? req.user.role : "unknown"} is not authorized to access this route` })
    }
    next()
  }
}

export { protect, authorizeRoles }

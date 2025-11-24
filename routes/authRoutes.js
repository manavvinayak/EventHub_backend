import express from "express"
import { signup, login, logout, getProfile, findDuplicateUsers } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", protect, logout) // Logout requires authentication
router.get("/profile", protect, getProfile) // Get profile requires authentication
router.get("/admin/duplicates", protect, findDuplicateUsers) // Admin only: find duplicate users

export default router

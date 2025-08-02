import express from "express"
import { registerForEvent, getUserRegistrations, cancelRegistration } from "../controllers/registrationController.js"
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

// Student-only routes
router.post("/register", protect, authorizeRoles("student", "admin"), registerForEvent) // Admin can also register
router.get("/my-registrations", protect, authorizeRoles("student", "admin"), getUserRegistrations)
router.delete("/:id", protect, authorizeRoles("student", "admin"), cancelRegistration)

export default router

import express from "express"
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} from "../controllers/eventController.js"
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getEvents)
router.get("/:id", getEventById)

// Admin-only routes
router.post("/", protect, authorizeRoles("admin"), createEvent)
router.put("/:id", protect, authorizeRoles("admin"), updateEvent)
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent)
router.get("/:id/attendees", protect, authorizeRoles("admin"), getEventAttendees)

export default router

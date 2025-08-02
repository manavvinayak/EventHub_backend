import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    organizer: {
      type: String, // e.g., "Computer Science Club"
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "/placeholder.svg?height=200&width=300",
    },
    tags: {
      type: [String], // e.g., ["tech", "workshop", "coding"]
      default: [],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Event = mongoose.model("Event", EventSchema)

export default Event

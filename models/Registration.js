import mongoose from "mongoose"

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

const Registration = mongoose.model("Registration", RegistrationSchema)

export default Registration

import Registration from "../models/Registration.js"
import Event from "../models/Event.js"

// @desc    Register user for an event
// @route   POST /api/registrations/register
// @access  Private/Student
const registerForEvent = async (req, res) => {
  const { eventId } = req.body
  const userId = req.user._id 

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const existingRegistration = await Registration.findOne({ userId, eventId })
    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" })
    }

    const registration = await Registration.create({
      userId,
      eventId,
    })

    event.attendees.push(userId)
    await event.save()

    res.status(201).json({ message: "Successfully registered for event", registration })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during registration" })
  }
}

// @desc    Get all registrations for the logged-in user
// @route   GET /api/registrations/my-registrations
// @access  Private/Student
const getUserRegistrations = async (req, res) => {
  const userId = req.user._id

  try {
    const registrations = await Registration.find({ userId }).populate(
      "eventId",
      "name description date time location organizer",
    ) 
    res.status(200).json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching user registrations" })
  }
}

// @desc    Cancel registration for an event
// @route   DELETE /api/registrations/:id
// @access  Private/Student
const cancelRegistration = async (req, res) => {
  const registrationId = req.params.id
  const userId = req.user._id

  try {
    const registration = await Registration.findById(registrationId)

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" })
    }

    if (registration.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this registration" })
    }

    const event = await Event.findById(registration.eventId)
    if (event) {
      event.attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== userId.toString())
      await event.save()
    }

    await Registration.deleteOne({ _id: registrationId })
    res.status(200).json({ message: "Registration cancelled successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error cancelling registration" })
  }
}

export { registerForEvent, getUserRegistrations, cancelRegistration }

import Event from "../models/Event.js"

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    console.log("getEvents called with query:", req.query)
    
    const { club, date, category, keyword } = req.query
    const query = {}

    if (club) {
      query.organizer = { $regex: club, $options: "i" } // Case-insensitive search
    }
    if (date) {
      // Assuming date is in YYYY-MM-DD format
      const startOfDay = new Date(date)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setUTCHours(23, 59, 59, 999)
      query.date = { $gte: startOfDay, $lte: endOfDay }
    }
    if (category) {
      query.tags = { $in: [new RegExp(category, "i")] } // Case-insensitive tag search
    }
    if (keyword) {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }]
    }

    console.log("MongoDB query:", JSON.stringify(query))
    
    const events = await Event.find(query).sort({ date: 1, time: 1 })
    console.log("Found events:", events.length)
    
    res.status(200).json(events)
  } catch (error) {
    console.error("getEvents error:", error)
    res.status(500).json({ message: "Server error fetching events" })
  }
}

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (event) {
      res.status(200).json(event)
    } else {
      res.status(404).json({ message: "Event not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching event" })
  }
}

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  const { name, description, date, time, location, organizer, tags, imageUrl } = req.body

  try {
    const newEvent = new Event({
      name,
      description,
      date,
      time,
      location,
      organizer,
      tags: tags || [],
      imageUrl: imageUrl || "/placeholder.svg?height=200&width=300",
    })

    const createdEvent = await newEvent.save()
    res.status(201).json(createdEvent)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error creating event" })
  }
}

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  const { name, description, date, time, location, organizer, tags, imageUrl } = req.body

  try {
    const event = await Event.findById(req.params.id)

    if (event) {
      event.name = name || event.name
      event.description = description || event.description
      event.date = date || event.date
      event.time = time || event.time
      event.location = location || event.location
      event.organizer = organizer || event.organizer
      event.tags = tags || event.tags
      event.imageUrl = imageUrl || event.imageUrl // Update image URL

      const updatedEvent = await event.save()
      res.status(200).json(updatedEvent)
    } else {
      res.status(404).json({ message: "Event not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error updating event" })
  }
}

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (event) {
      await Event.deleteOne({ _id: event._id }) // Use deleteOne for Mongoose 6+
      res.status(200).json({ message: "Event removed" })
    } else {
      res.status(404).json({ message: "Event not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error deleting event" })
  }
}

// @desc    Get attendees for a specific event
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("attendees", "username email")
    if (event) {
      res.status(200).json(event.attendees)
    } else {
      res.status(404).json({ message: "Event not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching attendees" })
  }
}

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventAttendees }

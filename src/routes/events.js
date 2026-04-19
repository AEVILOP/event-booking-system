const express = require("express");
const db = require("../database");
const { authenticate, authorize } = require("../middlewares");
const { success, error } = require("../utils/response");

const router = express.Router();

// GET EVENTS (pagination)
router.get("/", authenticate, (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const start = (page - 1) * limit;

    const data = db.events.slice(start, start + limit);

    return success(res, {
      total: db.events.length,
      page,
      data,
    });
  } catch (err) {
    next(err);
  }
});

// CREATE EVENT
router.post("/", authenticate, authorize(["organizer"]), (req, res, next) => {
  try {
    const { title, description, date, total_tickets } = req.body;

    if (!title || !date || !total_tickets) {
      return error(res, 400, "Missing fields");
    }

    if (total_tickets <= 0) {
      return error(res, 400, "Invalid ticket count");
    }

    const event = {
      id: db.eventIdCounter++,
      title,
      description,
      date,
      total_tickets,
      available_tickets: total_tickets,
      organizer_id: req.user.id,
    };

    db.events.push(event);

    return success(res, { eventId: event.id }, "Event created");
  } catch (err) {
    next(err);
  }
});

// UPDATE EVENT
router.put("/:id", authenticate, authorize(["organizer"]), (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = db.events.find((e) => e.id === eventId);
    
    if (!event) return error(res, 404, "Event not found");

    if (event.organizer_id !== req.user.id) {
      return error(res, 403, "Not authorized to update this event");
    }

    const { title, description, date, total_tickets } = req.body;
    
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (total_tickets && total_tickets > 0) {
      const difference = total_tickets - event.total_tickets;
      event.total_tickets = total_tickets;
      event.available_tickets += difference;
    }

    return success(res, { event }, "Event updated");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

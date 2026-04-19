const express = require("express");
const db = require("../database");
const { authenticate, authorize } = require("../middlewares");
const jobQueue = require("../queue");
const { success, error } = require("../utils/response");

const router = express.Router();

let bookingLock = false;

// CREATE BOOKING
router.post("/", authenticate, authorize(["customer"]), (req, res, next) => {
  try {
    const { eventId, tickets = 1 } = req.body;

    if (!eventId || tickets <= 0) {
      return error(res, 400, "Invalid input");
    }

    if (bookingLock) {
      return error(res, 503, "System busy");
    }

    bookingLock = true;

    const event = db.events.find((e) => e.id === eventId);
    if (!event) return error(res, 404, "Event not found");

    if (event.available_tickets < tickets) {
      return error(res, 400, "Not enough tickets");
    }

    event.available_tickets -= tickets;

    const booking = {
      id: db.bookingIdCounter++,
      user_id: req.user.id,
      event_id: eventId,
      tickets_booked: tickets,
    };

    db.bookings.push(booking);

    jobQueue.addJob("BookingConfirmation", {
      customerId: req.user.id,
      eventId,
      ticketsCount: tickets,
    });

    return success(res, { bookingId: booking.id }, "Booking successful");
  } catch (err) {
    next(err);
  } finally {
    bookingLock = false;
  }
});

module.exports = router;

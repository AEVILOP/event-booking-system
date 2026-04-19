const db = require("./database");

class JobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  addJob(name, data) {
    this.queue.push({ name, data });
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length) {
      const job = this.queue.shift();

      try {
        await this.execute(job);
      } catch (err) {
        console.error("Job failed:", job.name);
      }
    }

    this.processing = false;
  }

  async execute(job) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (job.name === "BookingConfirmation") {
          console.log(`[EMAIL] User ${job.data.customerId} booking confirmed`);
        }

        if (job.name === "EventUpdateNotification") {
          const bookings = db.bookings.filter(
            (b) => b.event_id === job.data.eventId,
          );

          bookings.forEach((b) => {
            console.log(`[NOTIFY] User ${b.user_id}`);
          });
        }

        resolve();
      }, 500);
    });
  }
}

module.exports = new JobQueue();

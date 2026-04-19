// In-memory Database to avoid Node-gyp VS build tool requirements on Windows
class MockDB {
  constructor() {
    this.users = [];
    this.events = [];
    this.bookings = [];
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.bookingIdCounter = 1;
  }
}

const db = new MockDB();
module.exports = db;

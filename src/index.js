const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const { errorHandler } = require("./middlewares");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on 3000");
});

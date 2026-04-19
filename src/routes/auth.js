const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const { success, error } = require("../utils/response");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

router.post("/register", async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return error(res, 400, "All fields required");
    }

    email = email.trim().toLowerCase();

    if (!["organizer", "customer"].includes(role)) {
      return error(res, 400, "Invalid role");
    }

    if (password.length < 6) {
      return error(res, 400, "Password too short");
    }

    const existing = db.users.find((u) => u.email === email);
    if (existing) return error(res, 409, "Email exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: db.userIdCounter++,
      name,
      email,
      password: hashed,
      role,
    };

    db.users.push(user);

    return success(res, { userId: user.id }, "Registered");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, "Missing credentials");
    }

    email = email.trim().toLowerCase();

    const user = db.users.find((u) => u.email === email);
    if (!user) return error(res, 401, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, 401, "Invalid credentials");

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return success(res, { token, role: user.role }, "Login success");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

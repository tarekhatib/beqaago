import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert into USERS only (NO vendors table)
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role === "vendor" ? "vendor" : "user"]
    );

    const userId = result.insertId;

    return res.status(201).json({
      message: "User registered successfully",
      userId
    });

  } catch (err) {
    console.error("❌ Registration error:", err); // full error now
    return res.status(500).json({ message: "Registration failed" });
  }
};

// SESSION LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    // --- SAVE USER IN SESSION ---
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.json({
      message: "Login successful (session active)",
      user: req.session.user,
    });

  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.clearCookie("user_session");
    return res.redirect("/login");
  });
};

// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import dbOptions from "./config/sessionDB.js";

// Models
import { getShopById } from "./models/shop.model.js";

// Proper __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Loaded env variables:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "✅ present" : "❌ missing");
console.log("DB_NAME:", process.env.DB_NAME);

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ============================
// USER PAGES
// ============================
app.get("/", (req, res) => res.render("index", { page: "home" }));
app.get("/login", (req, res) => res.render("login", { page: "login" }));
app.get("/register", (req, res) => res.render("register", { page: "register" }));

app.get("/dashboard", (req, res) =>
  res.render("dashboard", { page: "dashboard" })
);

app.get("/search", (req, res) =>
  res.render("search", { page: "search" })
);

app.get("/orders", (req, res) =>
  res.render("orders", { page: "orders" })
);

app.get("/account", (req, res) =>
  res.render("account", { page: "account" })
);

app.get("/cart", (req, res) =>
  res.render("cart", { page: "cart" })
);

// Store page (user clicks on shop card)
app.get("/store/:id", async (req, res) => {
  const shop = await getShopById(req.params.id);
  if (!shop) return res.status(404).send("Shop not found");

  res.render("store", {
    page: "store",
    shopId: shop.id,
    shopName: shop.name,
    shopLocation: shop.location || "Beqaa",
    shopIsOpen: shop.is_open || 0
  });
});

// ============================
// VENDOR PAGES
// ============================
app.get("/vendor/dashboard", (req, res) =>
  res.render("vendor/dashboard", { page: "vendor-dashboard" })
);

app.get("/vendor/menu", (req, res) =>
  res.render("vendor/menu", { page: "vendor-menu" })
);

app.get("/vendor/orders", (req, res) =>
  res.render("vendor/orders", { page: "vendor-orders" })
);

app.get("/vendor/settings", (req, res) =>
  res.render("vendor/settings", { page: "vendor-settings" })
);

app.get("/vendor/create-shop", (req, res) =>
  res.render("vendor/create-shop", { page: "vendor-create-shop" })
);

const MySQLStore = MySQLStoreFactory(session);

// create a session store connected to MySQL
const sessionStore = new MySQLStore(dbOptions);

app.use(
  session({
    key: "user_session",
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

// Make session user available to all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ============================
// API ROUTES
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);

// 404
app.use((req, res) => res.status(404).send("404 - Page Not Found"));

export default app;

import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { pool } from "../db.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have JWT_SECRET in your .env file

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded; // User Payload from Token
    next();
  });
};

// SUBMIT RATING (POST for new)
router.post("/rate", authenticateToken, async (req, res) => {
  const { store_name, stars } = req.body;
  const userId = req.user.id;

  if (!store_name || !stars) {
    return res.status(400).json({ message: "Store name and rating (stars) are required" });
  }

  if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
    return res.status(400).json({ message: "Rating must be an integer between 1 and 5 stars" });
  }

  try {
    const storeResult = await pool.query(
      "SELECT id FROM stores WHERE name = $1",
      [store_name]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existingRating = await pool.query(
      "SELECT id FROM ratings WHERE user_id = $1 AND store_name = $2",
      [userId, store_name]
    );

    if (existingRating.rows.length > 0) {
      return res.status(409).json({ message: "Rating already exists. Use PATCH to update." });
    }

    await pool.query(
      "INSERT INTO ratings (user_id, store_name, stars) VALUES ($1, $2, $3)",
      [userId, store_name, stars]
    );
    return res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Rating submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE RATING (PATCH for existing)
router.patch("/rate", authenticateToken, async (req, res) => {
  const { store_name, stars } = req.body;
  const userId = req.user.id;

  if (!store_name || !stars) {
    return res.status(400).json({ message: "Store name and rating (stars) are required" });
  }

  if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
    return res.status(400).json({ message: "Rating must be an integer between 1 and 5 stars" });
  }

  try {
    const storeResult = await pool.query(
      "SELECT id FROM stores WHERE name = $1",
      [store_name]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existingRating = await pool.query(
      "SELECT id FROM ratings WHERE user_id = $1 AND store_name = $2",
      [userId, store_name]
    );

    if (existingRating.rows.length === 0) {
      return res.status(404).json({ message: "Rating not found. Use POST to create a new rating." });
    }

    await pool.query(
      "UPDATE ratings SET stars = $1 WHERE user_id = $2 AND store_name = $3",
      [stars, userId, store_name]
    );

    return res.json({ message: "Rating updated successfully" });
  } catch (err) {
    console.error("Rating update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET TOTAL RATINGS COUNT
router.get("/ratings/total", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) as total_ratings FROM ratings");
    const totalRatings = result.rows[0].total_ratings;
    res.json({ total_ratings: parseInt(totalRatings) });
  } catch (err) {
    console.error("Fetch total ratings error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET STORE WITH RATINGS BY STORE NAME
router.get("/store/:storeName", async (req, res) => {
  const storeName = req.params.storeName;

  try {
    // Fetch store details
    const storeResult = await pool.query(
      "SELECT id, name, email, address, owner_id, img_url FROM stores WHERE name = $1",
      [storeName]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const store = storeResult.rows[0];

    // Fetch all ratings with user details for this store
    const ratingsResult = await pool.query(
      `SELECT r.user_id, r.stars, u.username, u.email 
       FROM ratings r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.store_name = $1`,
      [storeName]
    );

    const storeWithRatings = {
      store: {
        ...store,
        ratings: ratingsResult.rows,
      },
      avgRating: ratingsResult.rows.length > 0
        ? (ratingsResult.rows.reduce((sum, r) => sum + (r.stars || 0), 0) / ratingsResult.rows.length).toFixed(1)
        : 0,
      ratings: ratingsResult.rows,
    };

    res.json(storeWithRatings);
  } catch (err) {
    console.error("Fetch store error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ADD USER (ADMIN ONLY)
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

router.post("/add-user", authenticateToken, requireAdmin, async (req, res) => {
  const { username, email, address, password, role } = req.body;

  try {
    // Check for username or email already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query(
      `INSERT INTO users (username, email, address, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, address, role`,
      [username, email, address, hashedPassword, role || "user"]
    );

    const newUser = userResult.rows[0];

    if (role === "store-owner") {
      await pool.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES ($1, $2, $3, $4)`,
        [username, email, address, newUser.id] // use username as store name for now
      );
    }

    res.json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// SEARCH USERS AND STORES (ADMIN and NORMAL USERS)
router.get("/search", async (req, res) => {
  const searchQuery = `%${req.query.query?.toLowerCase() || ""}%`;

  try {
    // Fetch filtered users
    const usersResult = await pool.query(
      `SELECT id, username, email, address, role
       FROM users
       WHERE LOWER(username) LIKE $1
          OR LOWER(email) LIKE $1
          OR LOWER(address) LIKE $1
          OR LOWER(role) LIKE $1`,
      [searchQuery]
    );

    // Fetch filtered stores
    const storesResult = await pool.query(
      `SELECT name, email, address, owner_id, img_url
       FROM stores
       WHERE LOWER(name) LIKE $1
          OR LOWER(email) LIKE $1
          OR LOWER(address) LIKE $1`,
      [searchQuery]
    );

    // For each store, attach its ratings from the ratings table
    const storesWithRatings = await Promise.all(
      storesResult.rows.map(async (store) => {
        const ratingsResult = await pool.query(
          `SELECT user_id, stars FROM ratings WHERE store_name = $1`,
          [store.name]
        );
        return {
          ...store,
          ratings: ratingsResult.rows,
        };
      })
    );

    res.json({
      users: usersResult.rows,
      stores: storesWithRatings,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE PASSWORD (ALL USERS)
router.patch("/update-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await pool.query("SELECT id, password FROM users WHERE username=$1",
      [req.user.username],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedNewPassword, user.id]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// REGISTER (NORMAL USER ONLY)
router.post("/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Name must be between 3 and 30 characters.")
      .custom((value, { req }) => {
        if (req.body.role === "store-owner" && value.length < 20) {
          throw new Error("Store-owner username must be at least 20 characters.");
        }
        return true;
      }),
    body("email")
      .isEmail()
      .withMessage("Invalid email format."),
    body("address")
      .optional()
      .isLength({ max: 400 })
      .withMessage("Address must be at most 400 characters."),
    body("password")
      .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/)
      .withMessage("Password must be 8-16 characters, include at least one uppercase letter and one special character."),
    body("role")
      .optional()
      .isIn(["user", "store-owner", "admin"])
      .withMessage("Role must be user, store-owner, or admin.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password, address } = req.body;
    const role = req.body.role == "store-owner" ? "store-owner" : "user";

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (username, email, password, role, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, address",
        [username, email, hashedPassword, role || "user", address || null]
      );
      console.log(role);
      return res.json(result.rows[0]);
    } catch (err) {
      console.error("Registration Error: ", err);
      if (err.code === '23505') {
        const field = err.constraint.includes('username_key') ? 'Username' :
          err.constraint.includes('email_key') ? 'Email' : 'Field';
        return res.status(409).json({ error: `${field} is already taken.` });
      }
      res.status(500).json({ error: "Registration failed due to server error." });
    }
  }
);

// LOGIN (ALL USERS)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1 OR email=$1",
      [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token, user: { id: user.id, username: user.username, email: user.email, role: user.role, address: user.address },
    });
  } catch (err) {
    console.log(username);
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
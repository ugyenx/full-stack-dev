const express = require("express");
const router = express.Router();
const { csrfProtection } = require("../middleware/csrfMiddleware");

const { login, getUser, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { loginUserSchema } = require("../schemas/loginUserSchema");
const validate = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and sets an access token cookie.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */

router.post("/login", loginLimiter, validate(loginUserSchema), login);

router.post("/logout", authenticate, csrfProtection, logout);
router.get("/me", authenticate, getUser);
module.exports = router;

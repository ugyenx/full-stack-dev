const express = require("express");
const router = express.Router();

const { login, getUser, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { loginUserSchema } = require("../schemas/loginUserSchema");
const validate = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");
router.post("/login", loginLimiter, validate(loginUserSchema), login);

router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getUser);
module.exports = router;

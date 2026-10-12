const express = require("express");
const router = express.Router();

const { login, getUser } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
router.post("/login", login);
router.get("/me", authenticate, getUser);
module.exports = router;

const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
router.post("/login", login);
router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      userId: req.user.userId,
    },
    message: "Authentication successful",
  });
});
module.exports = router;

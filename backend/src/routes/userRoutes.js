const express = require("express");
const router = express.Router();
const { validateCreateUser } = require("../middleware/validateUser");
const { validateUserQuery } = require("../middleware/validateUserQuery");
const { validateCursorQuery } = require("../middleware/validateCursorQuery");
const { authenticate } = require("../middleware/authMiddleware");
const {
  validateCreatedCursorQuery,
} = require("../middleware/validateCreatedCursorQuery");
const {
  getUsers,
  getUsersCursor,
  getUserById,
  createUser,
  getUsersCreatedCursor,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");

router.get("/", validateUserQuery, getUsers);
router.get("/cursor", validateCursorQuery, getUsersCursor);
router.get(
  "/cursor-created",
  validateCreatedCursorQuery,
  getUsersCreatedCursor,
);
router.get("/admin-test", authenticate, authorize("manager"), (req, res) => {
  res.json({
    success: true,
    message: "you are admin user",
  });
});

router.get("/:id", getUserById);

router.post("/", validateCreateUser, createUser);

module.exports = router;

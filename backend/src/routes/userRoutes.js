const express = require("express");
const router = express.Router();
const { validateCreateUser } = require("../middleware/validateUser");
const { validateUserQuery } = require("../middleware/validateUserQuery");
const { validateCursorQuery } = require("../middleware/validateCursorQuery");
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

router.get("/", validateUserQuery, getUsers);
router.get("/cursor", validateCursorQuery, getUsersCursor);
router.get(
  "/cursor-created",
  validateCreatedCursorQuery,
  getUsersCreatedCursor,
);

router.get("/:id", getUserById);

router.post("/", validateCreateUser, createUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { validateCreateUser } = require("../middleware/validateUser");
const { validateUserQuery } = require("../middleware/validateUserQuery");
const {
  getUsers,
  getUserById,
  createUser,
} = require("../controllers/userController");

router.get("/", validateUserQuery, getUsers);

router.get("/:id", getUserById);

router.post("/", validateCreateUser, createUser);

module.exports = router;

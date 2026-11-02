const express = require("express");
const router = express.Router();
const { validateCreateUser } = require("../middleware/validateUser");
const { validateUserQuery } = require("../middleware/validateUserQuery");
const { validateCursorQuery } = require("../middleware/validateCursorQuery");
const { authenticate } = require("../middleware/authMiddleware");
const { registerUserSchema } = require("../schemas/userSchema");
const validate = require("../middleware/validate");
const {
  validateCreatedCursorQuery,
} = require("../middleware/validateCreatedCursorQuery");
const {
  getUsers,
  getUsersCursor,
  getUserById,
  createUser,
  getUsersCreatedCursor,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authorize");
const { updateUserSchema } = require("../schemas/updateUserSchema");

const { csrfProtection } = require("../middleware/csrfMiddleware");

//User Routes

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

router.get("/:id", authenticate, getUserById);
router.delete(
  "/:id",
  authenticate,
  csrfProtection,
  authorize("admin"),
  deleteUser,
);

router.post("/", validate(registerUserSchema), createUser);

router.patch(
  "/:id",
  authenticate,
  csrfProtection,
  validate(updateUserSchema),
  updateUser,
);

module.exports = router;

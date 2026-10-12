const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      data: user,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };

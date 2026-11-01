const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const result = await authService.login({ email, password });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    console.log(req.user);
    const userId = req.user.userId;
    const user = await authService.getUser(userId);
    res.status(200).json({
      success: true,
      data: {
        user,
      },
      message: "Authorization successfull",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { login, getUser, logout };

const config = require("../config/env");
const authService = require("../services/authService");
const { generateCsrfToken } = require("../utils/csrf");
const logger = require("../utils/logger");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const result = await authService.login({ email, password });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    const csrfToken = generateCsrfToken(result.accessToken);
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: config.NODE_ENV === "production",
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
    logger.info("User logged in Successfully");
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
  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("csrfToken", {
    ...cookieOptions,
    httpOnly: false,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { login, getUser, logout };

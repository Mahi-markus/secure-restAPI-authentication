const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token"); // Importing token functions

const CustomError = require("../utils/custom_error");

// In-memory store for refresh tokens
const refreshTokens = new Set();

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = new User({ email, password, role });
    await user.save();

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    throw new CustomError("Error registering user", 400);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" }); // Handle 404 for user not found
  }

  if (!(await user.comparePassword(password))) {
    throw new CustomError("Invalid credentials", 401);
  }

  // Use the imported functions to generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.add(refreshToken); // Save refresh token temporarily

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

exports.refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res
      .status(403)
      .json({ message: "Invalid or missing refresh token" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id }, // original user ID
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

//refresh endpoint
exports.refreshTokens = refreshTokens;

exports.getProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User profile not found" }); // Handle 404 for missing user profile
  }

  res.json({ user: req.user });
};

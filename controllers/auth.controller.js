const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const CustomError = require("../utils/custom_error");

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
  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

exports.getProfile = (req, res) => {
  res.json({ user: req.user });
};

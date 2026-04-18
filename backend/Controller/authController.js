const User = require("../Model/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
    return res.status(400).json({
  success: false,
  message: "Email already registered",
});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: req.body.role  
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error signing up",
      error: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ success: false, message: "Invalid Password" });
    }
 // 3. sign JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "JWT_SECRET not defined" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error logging in",
        error: error.message,
      });
  }
};

module.exports = { SignUp, Login };

import Customer from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateAcessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
const handleUserSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await Customer.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Signup error:", error);
  }
};
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use findOne instead of find to get a single user object, not an array
    const user = await Customer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add await to properly resolve the Promise
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Return the token in response
    return res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export {
  handleUserSignUp,
  handleUserLogin,
  generateAcessToken,
  generateRefreshToken,
};

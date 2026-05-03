import { userModel } from "../models/user";
import { generateToken } from "../utils/generateToken";
import { logger } from "../utils/logger";
import { validateRegistration } from "../utils/validation";

//user registration
export const registerUser = async (req, res) => {
  try {
    logger.info("Registration endpoint hit");
    const { error, value } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password, username } = value;
    let user = await userModel.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = new userModel({ username, email, password });
    user.save();
    const { accessToken, refreshtoken } = await generateToken(user);
    logger.info("User registration successful", user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        accessToken,
        refreshtoken,
      },
    });
  } catch (err) {
    logger.error("Registration error", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//user login

//refresh token

//logout

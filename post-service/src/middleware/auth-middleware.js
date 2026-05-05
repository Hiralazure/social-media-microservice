import logger from "../utils/logger.js";
export const authenticatedRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    logger.warn(`Access attempted without user id `);
    res.status(401).json({
      success: false,
      message: "Authenticatin required Please login to continue",
    });
  }
  req.user = { userId };
  next();
};

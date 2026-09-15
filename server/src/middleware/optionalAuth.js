import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId);

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

export default optionalAuth;

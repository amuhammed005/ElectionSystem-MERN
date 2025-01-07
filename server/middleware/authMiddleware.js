import jwt from "jsonwebtoken";
import { HttpError } from "../models/ErrorModel.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) {
          return next(new HttpError("Unauthorized: Invalid token.", 403));
        }

        req.user = info;
        next();
      });
    } else {
      throw new HttpError("Authorization header missing.", 401);
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

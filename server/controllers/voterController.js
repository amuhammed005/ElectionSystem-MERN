import mongoose from "mongoose";
import { HttpError } from "../models/ErrorModel.js";
import voterModel from "../models/voterModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= Register new voter
// Post : api/voters/register
// Unprotected
export const registerVoter = async (req, res, next) => {
  try {
    const { fullName, email, password, password2 } = req.body;

    if (!fullName || !email || !password || !password2) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    // make all emails lower case
    const newEmail = email.trim().toLowerCase();
    // check if email already exists in db
    const emailExists = await voterModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(
        new HttpError("Email already exists. Proceed to sign in", 422)
      );
    }
    // make sure password is 6+ characters or long
    if (password.trim().length < 6) {
      return next(
        new HttpError("Passwords should be at least 6 characters.", 422)
      );
    }
    // make sure passwords match
    if (password.trim() !== password2.trim()) {
      return next(new HttpError("Passwords do not match.", 422));
    }
    // if password match, hash using bcryptsjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // make a single email "__________" an admin
    let isAdmin = false;
    if (newEmail === process.env.ADMIN_EMAIL) {
      isAdmin = true;
    }
    // save new voter into the database
    const newVoter = await voterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      isAdmin,
    });

    res
      .status(201)
      .json({ success: true, data: `New voter ${fullName} created.` });
  } catch (error) {
    return next(new HttpError("Voter registration failed.", 422));
  }
};

// Generate a token
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

// ================= Voter login
// Post : api/voters/login
// Unprotected
export const loginVoter = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Input all fields."), 422);
    }
    // make email lower case
    const newEmail = email.trim().toLowerCase();
    // check if email exists in db
    const voter = await voterModel.findOne({ email: newEmail });
    if (!voter) {
      return next(
        new HttpError(
          "Invalid credentials. Please provide valid credentials or Sign Up.",
          422
        )
      );
    }
    // compare passwords
    const isValidPassword = await bcrypt.compare(
      password.trim(),
      voter.password.trim()
    );
    if (!isValidPassword) {
      return next(new HttpError("Invalid credentials.", 422));
    }
    // Generate JWT token
    const { _id: id, isAdmin, votedElections } = voter;
    const token = generateToken({ id, isAdmin });
    // Respond with token and user details
    res.json({ token, id, votedElections, isAdmin });
  } catch (error) {
    console.error("Error Login in", error.message);
    return next(
      new HttpError("Login attempt failed. Please try again later.", 500)
    );
  }
};

// ================= Get Voter
// Get : api/voters/:id
// Protected
export const getVoter = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError("Invalid voter ID.", 400));
    }
    if (req.user.id !== id && !req.user.isAdmin) {
      return next(
        new HttpError(
          "Access denied. Only the voter or an admin can perform this action.",
          403
        )
      );
    }

    //check if voter is admin
    //Find the voter by ID and exclude the password field
    const voter = await voterModel.findById(id).select("-password");

    // Handle case where voter is not found
    if (!voter) {
      return next(new HttpError("Voter not found.", 404));
    }
    // Respond with voter data
    res.status(200).json(voter);
  } catch (error) {
    console.error("Error fetching voter: ", error.message);
    return next(new HttpError("Fetching voter failed. Please try again.", 500));
  }
};

export const deleteVoter = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.isAdmin) {
      return next(new HttpError("Only an Admin can perform this action.", 422));
    }
    const response = await voterModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Voter deleted successfully." });
  } catch (error) {
    return next(new HttpError(error));
  }
};

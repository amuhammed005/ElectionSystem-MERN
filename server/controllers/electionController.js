import mongoose from "mongoose";
import { HttpError } from "../models/ErrorModel.js";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "../utils/cloudinary.js";

import electionModel from "../models/electionModel.js";
import candidateModel from "../models/candidateModel.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
/* ================= Add an Election
Post : api/election
Protected (Only by Admin) */
export const addElection = async (req, res, next) => {
  try {
    // First check if user is admin or not to grant or deny access
    if (!req.user.isAdmin) {
      return next(new HttpError("Only admins can perform this action.", 422));
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return next(new HttpError("Please provide all fields.", 422));
    }

    if (!req.files.thumbnail) {
      return next(new HttpError("Please choose a thumbnail to upload.", 422));
    }

    //check if thumbnail is > 1 MB
    const { thumbnail } = req.files;
    if (thumbnail.size > 1000000) {
      return next(new HttpError("File size should be less than 1MB.", 422));
    }

    //rename the uploaded file (thumbnail)
    let fileName = thumbnail.name;
    fileName = fileName.split(".");
    fileName = fileName[0] + uuidv4() + "." + fileName[fileName.length - 1];

    // upload the file to the uploads folder
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);
    await thumbnail.mv(uploadPath, async (err) => {
      if (err) {
        return next(HttpError(err));
      }
      // save image to cloudinary as soon as it is saved in uploads folder
      const result = await cloudinary.uploader.upload(uploadPath, {
        resource_type: "image",
      });

      if (!result.secure_url) {
        return next(new HttpError("Couldn't upload image to cloudinary.", 422));
      }
      // Save Election to db
      const newElection = await electionModel.create({
        title,
        description,
        thumbnail: result.secure_url,
      });
      res.status(200).json(newElection);
    });
  } catch (error) {
    console.error(error.message);
    return next(new HttpError(error));
  }
};

// ================= Get all Elections
// Post : api/elections
// Protected
export const getElections = async (req, res, next) => {
  try {
    const allElections = await electionModel.find({});
    res.status(200).json(allElections);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ================= Get a Particular Election
// Post : api/elections/:id
// Protected
export const getElection = async (req, res, next) => {
  const { id } = req.params;
  try {
    const election = await electionModel.findById(id);
    res.status(200).json(election);
  } catch (error) {
    return next(new HttpError("Could not find election.", 422));
  }
};

// ================= Get all Candidates of an Election
// Post : api/elections/:id/candidates
// Protected
export const getElectionCandidates = async (req, res, next) => {
  try {
    const { id } = req.params;
    const electionCandidates = await candidateModel.find({ election: id });
    res.status(200).json(electionCandidates);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ================= Get all Voters of an Elections
// Post : api/elections/:id/voters
// Protected
export const getElectionVoters = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await electionModel.findById(id).populate("voters");
    res.status(200).json(response.voters);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ================= Update an Election
// Post : api/elections/:id
// Protected (Only by admin)
export const updateElection = async (req, res, next) => {
  try {
    //check if user to perform action is admin or not
    if (!req.user.isAdmin) {
      return next(new HttpError("Only Admins can perform this action"));
    }

    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    if (!req.files || !req.files.thumbnail) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // check if thumbnail size > 1 MB
    const { thumbnail } = req.files;
    if (thumbnail.size > 1000000) {
      return next(
        new HttpError(
          "File size too large. File size should be less than 1MB.",
          422
        )
      );
    }

    // Rename thumbnail
    let fileName = thumbnail.name;
    fileName = fileName.split(".");
    fileName = fileName[0] + uuidv4() + "." + fileName[fileName.length - 1];
    // Save file to upload folder
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);
    await thumbnail.mv(uploadPath, async (err) => {
      if (err) {
        return next(new HttpError(err));
      }
      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(uploadPath, {
        resource_type: "image",
      });

      if (!result.secure_url) {
        return next(new HttpError("Couldn't upload file to cloudinary.", 422));
      }
      const updatedElection = await electionModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          thumbnail: result.secure_url,
        },
        { new: true }
      );

      res.status(200).json({ success: true, message: updatedElection });
    });
  } catch (error) {
    console.log("something happend: ", error.message);
    return next(new HttpError(error));
  }
};

// ================= Remove/Delete an Election
// Post : api/elections/:id
// Protected (Only by admin)
export const removeElection = async (req, res, next) => {
  // First check if user is admin or not to grant or deny access
  if (!req.user.isAdmin) {
    return next(new HttpError("Only admins can perform this action.", 422));
  }

  try {
    const { id } = req.params;
    // Delete election with the specified id.
    await electionModel.findByIdAndDelete(id);
    await candidateModel.deleteMany({ election: id });
    res
      .status(200)
      .json({ status: "success", message: "ELection Deleted Successfully" });

    // Delete all candidates that beleong to the election that has been deleted

    // res.status(200).json("Candidates to this election deleted successfully.")
  } catch (error) {
    return next(new HttpError(error));
  }
};

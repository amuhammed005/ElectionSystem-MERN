import mongoose from "mongoose";
import { HttpError } from "../models/ErrorModel.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../utils/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import candidateModel from "../models/candidateModel.js";
import electionModel from "../models/electionModel.js";
import voterModel from "../models/voterModel.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// ================= Add a Candidate
// Post : api/candidates
// Protected (Admin Only)
export const addCandidate = async (req, res, next) => {
  try {
    //check if action to be performed is done by an admin
    if (!req.user.isAdmin) {
      return next(new HttpError("Only an Admin can perform this action.", 422));
    }
    // Validate input fields
    const { fullName, motto, currentElection } = req.body;
    if (!fullName || !motto || !currentElection) {
      return next(new HttpError("Input all fields.", 422));
    }
    // Valid image
    if (!req.files || !req.files.image) {
      return next(new HttpError("Select an image to upload.", 422));
    }
    //check if image size is greater than 1 MB
    const { image } = req.files;
    if (image.size > 1000000) {
      return next(new HttpError("Image size must be less than 1MB.", 422));
    }
    // Rename and move image to uploads folder
    let fileName = image.name.split(".");
    fileName = fileName[0] + uuidv4() + "." + fileName[fileName.length - 1];

    //upoad image to local uploads folder
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);
    await image.mv(uploadPath, async (err) => {
      if (err) {
        return next(new HttpError("Failed to save image to uploads.", 422));
      }
    });
    //Upload to cloudinary
    const result = await cloudinary.uploader.upload(uploadPath, {
      resource_type: "image",
    });
    if (!result.secure_url) {
      return next(new HttpError("Failed to upload image to cloudinary.", 422));
    }
    // Create a new Candidate
    let newCandidate = await candidateModel.create({
      fullName,
      motto,
      image: result.secure_url,
      election: currentElection,
    });
    // Validate Election
    let election = await electionModel.findById(currentElection);
    if (!election) {
      return next(new HttpError("Election not found.", 404));
    }
    //establish a session, save candidate and associate with election
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newCandidate.save();
    election.candidates.push(newCandidate);
    await election.save({ Session: sess });
    await sess.commitTransaction();

    res
      .status(200)
      .json({ success: true, message: "Candidate added successfully." });
  } catch (error) {
    return next(new HttpError("Failed to add candidate.", 404));
  }
};

// ================= Get a Candidate
// Get : api/candidates/:id
// Protected
export const getCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await candidateModel.findById(id);
    res.status(200).json(candidate);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the action is performed by an admin
    if (!req.user.isAdmin) {
      return next(new HttpError("Only an Admin can perform this action.", 403));
    }

    const currentCandidate = await candidateModel
      .findById(id)
      .populate("election");

    // Check if the candidate exists
    if (!currentCandidate) {
      return next(new HttpError("Candidate not found.", 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
      await currentCandidate.deleteOne({ session: sess });
      currentCandidate.election.candidates.pull(currentCandidate);
      await currentCandidate.election.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      await sess.abortTransaction();
      throw err;
    } finally {
      sess.endSession();
    }

    res
      .status(200)
      .json({ success: true, message: "Candidate deleted successfully." });
  } catch (error) {
    return next(
      new HttpError(
        error.message || "An error occurred while deleting the candidate.",
        500
      )
    );
  }
};

export const voteCandidate = async (req, res, next) => {
  try {
    const { id: candidateId } = req.params;
    const { selectedElection } = req.body;

    console.log("Candidate ID:", candidateId);
    console.log("Selected Election ID:", selectedElection);

    //get the candidate
    const candidate = await candidateModel.findById(candidateId);
    const newVoteCount = candidate.voteCount + 1;
    //Update candidate's votes
    await candidateModel.findByIdAndUpdate(
      candidateId,
      { voteCount: newVoteCount },
      { new: true }
    );
    //start session for relationship between election and voter
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // get the current voter
    let voter = await voterModel.findById(req.user.id);
    await voter.save({ session: sess });
    // get selected election
    let election = await electionModel.findById(selectedElection);
    election.voters.push(voter);
    voter.votedElections.push(election);
    await election.save({ session: sess });
    await voter.save({ session: sess });
    await sess.commitTransaction();
    res.status(200).json(voter.votedElections);
  } catch (error) {
    return next(new HttpError(error));
  }
};

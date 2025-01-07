import { timeStamp } from "console";
import mongoose, { Schema, Types } from "mongoose";

const voterSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    votedElections: {
      type: [{ type: Types.ObjectId, ref: "Election", required: true }],
      default: [],
    },
  },
  { timestamps: true }
);

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;

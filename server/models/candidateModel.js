import mongoose, { Types } from "mongoose";
import { types } from "util";

const candidateSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    image: {type: String, required: true},
    motto: {type: String, required: true},
    voteCount: {type: Number, default: 0},
    election: {type: Types.ObjectId, required: true, ref: "Election"}
}, {timestamps: true})

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate
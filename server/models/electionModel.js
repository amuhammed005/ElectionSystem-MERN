import mongoose, { Types } from "mongoose";

const electionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    thumbnail: {type: String, required: true},
    voters: {type: [{type: Types.ObjectId, required: true, ref: "Voter"}], default: []},
    candidates: {type: [{type: Types.ObjectId, required: true, ref: "Candidate"}], default: []}
})

const Election = mongoose.model("Election", electionSchema);

export default Election;
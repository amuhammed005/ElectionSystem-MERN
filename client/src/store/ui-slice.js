import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAddCandidateModalShowing(state) {
      state.addCandidateModalShowing = true;
    },
    closeAddCandidateModalShowing(state) {
      state.addCandidateModalShowing = false;
    },
    openVoteCandidateModalShowing(state) {
      state.voteCandidateModalShowing = true;
    },
    closeVoteCandidateModalShowing(state) {
      state.voteCandidateModalShowing = false;
    },
    openElectionModalShowing(state) {
      state.electionModalShowing = true;
    },
    closeElectionModalShowing(state) {
      state.electionModalShowing = false;
    },
    openUpdateElectionModalShowing(state) {
      state.updateElectionModalShowing = true;
    },
    closeUpdateElectionModalShowing(state) {
      state.updateElectionModalShowing = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice
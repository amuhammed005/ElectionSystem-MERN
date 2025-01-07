import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerVoter,
  loginVoter,
  getVoter,
  deleteVoter
} from "../controllers/voterController.js";

import {
  getElection,
  getElections,
  getElectionCandidates,
  getElectionVoters,
  addElection,
  updateElection,
  removeElection,
} from "../controllers/electionController.js";

import {
  addCandidate,
  getCandidate,
  deleteCandidate,
  voteCandidate,
} from "../controllers/candidateController.js";

const router = express.Router();

// Voters routes
router.post("/voters/register", registerVoter);
router.post("/voters/login", loginVoter);
router.get("/voters/:id", authMiddleware, getVoter);
router.delete("/voters/:id", authMiddleware, deleteVoter);

// Elections routes
router.get("/elections", authMiddleware, getElections);
router.get("/elections/:id", authMiddleware, getElection);
router.get("/elections/:id/candidates", authMiddleware, getElectionCandidates);
router.get("/elections/:id/voters", authMiddleware, getElectionVoters);
router.post("/elections", authMiddleware, addElection);
router.patch("/elections/:id", authMiddleware, updateElection);
router.delete("/elections/:id", authMiddleware, removeElection);

// Candidates Routes
router.get("/candidates/:id", authMiddleware, getCandidate);
router.post("/candidates", authMiddleware, addCandidate);
router.delete("/candidates/:id", authMiddleware, deleteCandidate);
router.patch("/candidates/:id", authMiddleware, voteCandidate);

export default router;

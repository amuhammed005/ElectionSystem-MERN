import React, { useEffect, useState } from "react";
// import { candidates } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import axios from "axios";
import { voteActions } from "../store/vote-slice";
import { useNavigate } from "react-router-dom";

const ConfirmVote = ({ selectedElection }) => {
  console.log("Selected Election ID:", selectedElection);

  const [modalCandidate, setModalCandidate] = useState({});

  const dispatch = useDispatch();

  const navigate = useNavigate();
  // close confirm vote modal
  const closeCandidateModal = () => {
    dispatch(uiActions.closeVoteCandidateModalShowing());
  };

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const currentVoter = useSelector((state) => state?.vote?.currentVoter);
  // get selected candidate id from redux store
  const selectedVoteCandidate = useSelector(
    (state) => state?.vote?.selectedVoteCandidate
  );

  //get the selected candidate
  // const fetchCandidate = () => {
  //   candidates.find((candidate) => {
  //     if (candidate.id === selectedVoteCandidate) {
  //       setModalCandidate(candidate);
  //     }
  //   });

  // };

  // Get the candidates selected to be voted for in a chosen election
  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      const results = await response.data;
      setModalCandidate(results);
    } catch (error) {
      console.log(error);
    }
  };

  // Confirm Vote for selected candidate
  const confirmVote = async () => {
    try {
      if (!selectedVoteCandidate || !selectedElection) {
        throw new Error("Missing candidate or election ID.");
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        { selectedElection },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const voteResult = await response.data;
      dispatch(
        voteActions.changeCurrentVoter({
          ...currentVoter,
          votedElections: voteResult,
        })
      );

      navigate("/congrats");
    } catch (error) {
      console.error("Error confirming vote.", error.message);
      alert("An error occurred while casting your vote.");
    }

    closeCandidateModal();
  };

  useEffect(() => {
    fetchCandidate();
  }, []);

  return (
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        <h5>Please confirm your vote</h5>
        <div className="confirm__vote-image">
          <img src={modalCandidate.image} alt={modalCandidate.fullName} />
        </div>
        <h2>
          {modalCandidate?.fullName?.length > 17
            ? modalCandidate?.fullName.substring(0, 17) + "..."
            : modalCandidate?.fullName}
        </h2>
        <p>
          {modalCandidate?.motto?.length > 40
            ? modalCandidate?.motto.substring(0, 40) + "..."
            : modalCandidate?.motto}
        </p>
        <div className="confirm__vote-cta">
          <button className="btn" onClick={closeCandidateModal}>
            Cancel
          </button>
          <button className="btn primary" onClick={confirmVote}>
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;

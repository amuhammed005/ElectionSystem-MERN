import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import Loader from "../components/Loader";

const Candidates = () => {
  const { id: selectedElection } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [canVote, setCanVote] = useState(true);
  const [loading, setLoading] = useState(true); // Loading state

  const voteCandidateModalShowing = useSelector(
    (state) => state.ui.voteCandidateModalShowing
  );
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const voterId = useSelector((state) => state?.vote?.currentVoter?.id);

  const getCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const getVoter = async () => {
    try {
      if (!voterId || !token) throw new Error("Invalid voter ID or token");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/voters/${voterId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const votedElections = response.data.votedElections || [];
      if (votedElections.includes(selectedElection)) {
        setCanVote(false);
      }
    } catch (error) {
      console.error("Error fetching voter data:", error.message);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const fetchData = async () => {
      setLoading(true); // Start loading
      await Promise.all([getCandidates(), getVoter()]);
      setLoading(false); // Stop loading once both calls are done
    };

    fetchData();

    //
  }, [selectedElection, voterId, token, navigate]);

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <>
      <section className="candidates">
        {!canVote ? (
          <header className="candidates__header">
            <h1>Already Voted</h1>
            <p>
              You are only permitted to vote once. Please vote in another
              election or sign out.
            </p>
          </header>
        ) : candidates.length > 0 ? (
          <>
            <header className="candidates__header">
              <h1>Vote Your Candidate</h1>
              <p>
                These are the candidates for the selected election. Please vote
                wisely, as you won't be allowed to vote again in this election.
              </p>
            </header>
            <div className="container candidates__container">
              {candidates.map((candidate) => (
                <Candidate key={candidate._id} {...candidate} />
              ))}
            </div>
          </>
        ) : (
          <header className="candidates__header">
            <h1>Inactive Election</h1>
            <p>
              There are no candidates for this election. Please check back
              later.
            </p>
          </header>
        )}
      </section>
      {voteCandidateModalShowing && (
        <ConfirmVote selectedElection={selectedElection} />
      )}
    </>
  );
};

export default Candidates;

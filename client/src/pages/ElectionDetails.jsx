import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ElectionCandidate from "../components/ElectionCandidate";
// import { elections } from "../data";
// import { candidates } from "../data";
// import { voters } from "../data";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import AddCandidateModal from "../components/AddCandidateModal";
import axios from "axios";
import Loader from "../components/Loader";
import confirmDelete from "../utils/confrimDelete.js";
import { voteActions } from "../store/vote-slice.js";

const ElectionDetails = () => {
  const [election, setElection] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleAddCandidateModalShowing = () => {
    dispatch(uiActions.openAddCandidateModalShowing());
    dispatch(voteActions.changeAddCandidateElectionId(id));
  };

  const addCandidateModalShowing = useSelector(
    (state) => state.ui.addCandidateModalShowing
  );
  console.log("addCandidateModalShowing: ", addCandidateModalShowing);
  //get selected election id

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
  const fetchSelectedElection = async () => {
    setIsloading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response) {
        console.log("Err fetching election", response);
      }
      console.log("Selected Election", response.data);
      setElection(response.data);
    } catch (error) {
      console.error(error.message);
    }
    setIsloading(false);
  };

  const fetchElectionCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response) {
        console.log("Err fetching election", response);
      }
      console.log("Election Candidates", response.data);
      setElectionCandidates(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchElectionVoters = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/voters`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response) {
        console.log("Err fetching election", response);
      }
      console.log("Election voters", response.data);
      setVoters(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteElection = async () => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/elections/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response) {
          console.log("Election deleted");
          navigate("/elections");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  useEffect(() => {
    fetchSelectedElection();
    fetchElectionCandidates();
    fetchElectionVoters();
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      {isLoading && <Loader />}
      <section className="electionDetails section__container">
        <div className="electionDetails__container">
          <h2>{election.title}</h2>
          <p>{election.description}</p>
        </div>
        <div className="electionDetails__image">
          <img src={election.thumbnail} alt={election.title} />
        </div>

        <menu className="electionDetails__candidates">
          {electionCandidates.map((candidate) => (
            <ElectionCandidate key={candidate._id} {...candidate} />
          ))}
          {isAdmin && (
            <button
              className="add__candidate-btn"
              onClick={handleAddCandidateModalShowing}
            >
              <IoAddOutline />
            </button>
          )}
        </menu>

        <menu className="voters">
          <h2>Voters</h2>
          <table className="voters__table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter) => (
                <tr key={voter._id}>
                  <td>{voter.fullName}</td>
                  <td>{voter.email}</td>
                  <td>{new Date(voter.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </menu>
        {isAdmin && (
          <button className="btn danger full" onClick={handleDeleteElection}>
            Delete Election
          </button>
        )}
      </section>

      {addCandidateModalShowing && <AddCandidateModal />}
    </>
  );
};

export default ElectionDetails;

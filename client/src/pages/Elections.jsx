import React, { useEffect, useState } from "react";
// import { elections as dummyElections } from "../data";
import Election from "../components/Election";
import AddElectionModal from "../components/AddElectionModal";
import UpdateElectionModal from "../components/UpdateElectionModal";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  // open election modal
  const openAddElectionModal = () => {
    dispatch(uiActions.openElectionModalShowing());
  };

  // set the initial state for election modal showing to false
  const electionModalShowing = useSelector(
    (state) => state.ui.electionModalShowing
  );

  // set the initial state for update election modal showing to false
  const updateElectionModalShowing = useSelector(
    (state) => state.ui.updateElectionModalShowing
  );

  // Get all elections from db
  const getElections = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      const results = await response.data;
      // Set elections collected from DB
      setElections(results);
      //
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getElections();
    //
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      <section className="elections">
        <div className="container elections__container">
          <header className="elections__header">
            <h1>Ongoing Elections</h1>
            {isAdmin && (
              <button className="btn primary" onClick={openAddElectionModal}>
                Create New Election
              </button>
            )}
          </header>
          {isLoading ? (
            <Loader />
          ) : (
            <menu className="elections__menu">
              {elections.map((election) => (
                <Election key={election._id} {...election} />
              ))}
            </menu>
          )}
        </div>

        {electionModalShowing && <AddElectionModal />}
        {updateElectionModalShowing && <UpdateElectionModal />}
      </section>
    </>
  );
};

export default Elections;

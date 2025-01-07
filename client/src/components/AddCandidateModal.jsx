import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCandidateModal = () => {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const electionId = useSelector(
    (state) => state?.vote?.addCandidateElectionId
  );

  const handleAddCandidate = async (e) => {
    try {
      e.preventDefault();
      // Log the details to debug
      console.log("API URL:", `${process.env.REACT_APP_API_URL}/candidates`);
      console.log("Election ID:", electionId);
      /////////
      const candidateInfo = new FormData();
      candidateInfo.set("fullName", fullName);
      candidateInfo.set("motto", motto);
      candidateInfo.set("image", image);
      candidateInfo.set("currentElection", electionId);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/candidates`,
        candidateInfo,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Response adding candidate: ", response.data);
      navigate(0);
    } catch (error) {
      console.error(error.message);
    }
  };

  // function to close add candidate modal showing
  const closeCandidateModal = () => {
    dispatch(uiActions.closeAddCandidateModalShowing());
  };
  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Add Candidate</h4>
          <button className="modal__close button" onClick={closeCandidateModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={handleAddCandidate}>
          <div>
            <h6>Candidate Name:</h6>
            <input
              type="text"
              value={fullName}
              name="fullName"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <h6>Candidate Motto:</h6>
            <input
              type="text"
              value={motto}
              name="motto"
              onChange={(e) => setMotto(e.target.value)}
            />
          </div>
          <div>
            <h6>Candidate Image:</h6>
            <input
              type="file"
              name="image"
              // value={image}
              onChange={(e) => setImage(e.target.files[0])}
              accept="jpg, jpeg, png, webp"
            />
          </div>
          <button type="submit" className="btn primary">
            Add Candidate
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;

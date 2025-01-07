import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  //function to close Election Modal
  const closeElectionModal = () => {
    dispatch(uiActions.closeElectionModalShowing());
  };

  const createElection = async (e) => {
    e.preventDefault();
    const electionData = new FormData();
    electionData.set("title", title);
    electionData.set("description", description);
    electionData.set("thumbnail", thumbnail);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/elections`,
        electionData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("create election response:", response.data);
      closeElectionModal();
      navigate(0);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Create New Election</h4>
          <button className="modal__close button" onClick={closeElectionModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={createElection}>
          <div>
            <h6>Election Title</h6>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <h6>Election Description</h6>
            <input
              type="text"
              value={description}
              name="description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <h6>Election Thumbnail</h6>
            <input
              type="file"
              accept="png, jpg, jpeg, webp, avif"
              name="thumbnail"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn primary">
            Add Election
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddElectionModal;

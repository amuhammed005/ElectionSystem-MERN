import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const idOfElectionToUpdate = useSelector(
    (state) => state?.vote?.idOfElectionToUpdate
  );
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  console.log("Token:", token);

  //function to close Update Election Modal
  const closeUpdateElectionModal = () => {
    dispatch(uiActions.closeUpdateElectionModalShowing());
  };

  const fetchElection = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("get election to update response: ", response);
      const election = await response.data;
      setTitle(election.title);
      setDescription(election.description);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchElection();
  }, []);

  const updateElection = async (e) => {
    e.preventDefault();
    try {
      const electionData = new FormData();
      electionData.set("title", title);
      electionData.set("description", description);
      if (thumbnail) {
        electionData.set("thumbnail", thumbnail); // Only if there's a file selected
      }
      console.log("Form Data:", {
        title,
        description,
        thumbnail: thumbnail ? thumbnail.name : "No file selected",
      });

      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,
        electionData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response for updated election", response.data);
      naviagte(0);
    } catch (error) {
      console.error("Error updating election:", error.message);
    }
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Edit Election Info</h4>
          <button
            className="modal__close button"
            onClick={closeUpdateElectionModal}
          >
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={updateElection}>
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
            Update Election
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElectionModal;

import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { useSelector } from "react-redux";
import confirmDelete from "../utils/confrimDelete.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ElectionCandidate = ({ fullName, motto, image, _id: id }) => {
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  const navigate = useNavigate();

  const handleDeleteElection = async () => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/candidates/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response) {
          console.log("Election deleted");
          navigate(0);
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <li className="electionCandidate">
      <div className="electionCandidate__image">
        <img src={image} alt={fullName} />
      </div>
      <div>
        <h5>{fullName}</h5>
        <small>
          {motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}
        </small>
        {isAdmin && (
          <button
            className="electionCandidate__btn"
            onClick={handleDeleteElection}
          >
            <IoMdTrash />{" "}
          </button>
        )}
      </div>
    </li>
  );
};

export default ElectionCandidate;

import React from "react";

const CandidateRating = ({ fullName, image, voteCount, totalVotes }) => {
  return (
    <li className="result__candidate">
      <div className="result__candidate-image">
        <img src={image} alt={fullName} />
      </div>
      <div className="result__candidate-info">
        <div>
          <h5>{fullName}</h5>
          <small>{`${voteCount} ${voteCount === 1 ? "vote" : "votes"} `}</small>
        </div>
        <div className="result__candidate-rating">
          <div className="result__candidate-loader">
            <span
              style={{
                width: `${voteCount > 0 ? (voteCount / totalVotes) * 100 : 0}%`,
              }}
            ></span>
          </div>
          <small>
            {`${
              voteCount > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0
            }%`}
          </small>
        </div>
      </div>
    </li>
  );
};

export default CandidateRating;

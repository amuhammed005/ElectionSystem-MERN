import React from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import { voteActions } from '../store/vote-slice';


const Candidate = ({ _id:id , image, fullName, motto }) => {

  const dispatch = useDispatch();

  const openVoteCandidateModal = () => {
    dispatch(uiActions.openVoteCandidateModalShowing());
    dispatch(voteActions.changeSelectedVoteCandidate(id));
  }

  return (
    <article className="candidate">
      <div className="candidate__image">
        <img src={image} alt={fullName} />
      </div>
      <h5>
        {fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}
      </h5>
      <small>
        {motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}
      </small>
      <button className="btn primary" onClick={openVoteCandidateModal}>
        Vote
      </button>
    </article>
  );
}

export default Candidate
import React from 'react';
import PropTypes from 'prop-types';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import './TeamMemberList.css';

const TeamMembersList = ({ members, setMembers }) => {
  const handleDeleteMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  return (
    <>
      {members.map((member, index) => (
        <div key={index} className="member">
          {member}
          <CloseOutlinedIcon
            onClick={() => handleDeleteMember(index)}
            style={{
              color: '#98A2B3',
              fontSize: '12px',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          />
        </div>
      ))}
    </>
  );
};

TeamMembersList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  setMembers: PropTypes.func.isRequired, // Ensures setMembers is a function
};

export default TeamMembersList;

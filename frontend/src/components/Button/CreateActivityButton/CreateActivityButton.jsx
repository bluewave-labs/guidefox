import React from 'react';
import Button from '../Button';
import './CreateActivityButtonStyles.css';
import CheckIcon from '../../CheckIcon/CheckIcon';
import PropTypes from 'prop-types';
import {
  activityData,
  ACTIVITY_TYPES,
} from '../../../data/createActivityButtonData';

const CreateActivityButton = ({ type = ACTIVITY_TYPES.HINTS, onClick }) => {
  const { heading, listItem, buttonText } = activityData[type];

  return (
    <div className="bannerStyle">
      <div className="bannerContents">
        <h2 className="heading">{heading}</h2>
        <ul>
          {listItem.map((item, index) => (
            <div className="list" key={index}>
              <CheckIcon size="small" outline={true} color="purple" />
              <li className="listText" key={index}>
                {item}
              </li>
            </div>
          ))}
        </ul>
      </div>
      <div className="button">
        <Button
          text={buttonText}
          className="button-primary-custom buttonStyle"
          onClick={onClick}
          variant="contained"
          buttonType="primary"
        />
      </div>
    </div>
  );
};

CreateActivityButton.propTypes = {
  type: PropTypes.oneOf(Object.values(ACTIVITY_TYPES)).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CreateActivityButton;

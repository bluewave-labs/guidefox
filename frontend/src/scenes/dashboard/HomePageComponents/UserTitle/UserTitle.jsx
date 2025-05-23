import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserTitle.module.scss';

const UserTitle = ({ name }) => {
  return (
    <div className={styles.title}>
      Copy the code in Settings here to see your guides!
    </div>
  );
};

UserTitle.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UserTitle;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserTitle.module.scss';

const UserTitle = ({ name }) => {
  return <div className={styles.title}>Hello, {name}</div>;
};

UserTitle.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UserTitle;

import React from 'react';
import PropTypes from 'prop-types';

const ContentArea = ({ children }) => {
  return <div className="content-area">{children}</div>;
};

ContentArea.propTypes = {
  children: PropTypes.node,
};

export default ContentArea;

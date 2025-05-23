import PropTypes from 'prop-types';

const IconWrapper = ({ children, label, ...props }) => (
  <svg
    role="img"
    aria-label={label}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

IconWrapper.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
};

export default IconWrapper;

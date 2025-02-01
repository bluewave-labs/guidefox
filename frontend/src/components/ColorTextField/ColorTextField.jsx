import { React } from 'react';
import PropTypes from 'prop-types';
import { MuiColorInput } from 'mui-color-input';
import styles from './ColorTextField.module.scss';

const ColorTextField = ({
  onChange = () => null,
  value = null,
  error = false,
}) => {
  return (
    <MuiColorInput
      className={styles.colorTextField}
      format="hex"
      isAlphaHidden={true}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

ColorTextField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.bool,
};

export default ColorTextField;

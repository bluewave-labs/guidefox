import { React } from 'react';
import PropTypes from 'prop-types';
import { MuiColorInput } from 'mui-color-input';
import styles from './ColorTextField.module.scss';

const ColorTextField = ({
  name = '',
  onChange = () => null,
  onBlur = () => null,
  value = null,
  error = false,
}) => {
  return (
    <MuiColorInput
      className={styles.colorTextField}
      name={name}
      format="hex"
      isAlphaHidden={true}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
    />
  );
};

ColorTextField.propTypes = {
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.bool,
};

export default ColorTextField;

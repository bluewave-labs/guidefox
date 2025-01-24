import { MuiColorInput } from 'mui-color-input';
import { React } from 'react';
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

export default ColorTextField;

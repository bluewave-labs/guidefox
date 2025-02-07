import { MuiColorInput } from 'mui-color-input';
import { React } from 'react';
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

export default ColorTextField;

import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import styles from './RadioButtonStyles.module.css'; 

const CustomRadioIcon = styled('span')({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
});

const CustomRadioCheckedIcon = styled('span')({
  borderRadius: '50%',
  backgroundColor: 'var(--main-purple)',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff, #fff 28%, transparent 32%)',
    content: '""',
  },
});

function RadioButton({ 
  id, 
  name, 
  value, 
  label, 
  onChange, 
  onClick, 
  size = 'small', 
  checked = false, 
  enabled = true 
}) {

  const handleChange = (event) => {
    if (checked) {
      onChange({ target: { name, value: '' } });
    } else {
      onChange(event);
    }
  };

  return (
    <div className={styles.radioButton}>
      <Radio
        id={id}
        name={name}
        value={value}
        disabled={!enabled}
        onChange={handleChange}
        size={size}
        checkedIcon={<CustomRadioCheckedIcon />}
        icon={<CustomRadioIcon />}
        checked={checked}
        onClick={onClick}
        sx={{ padding: '0' }}
      />
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
    </div>
  );
}

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
  color: PropTypes.string,
  checked: PropTypes.bool,
};

export default RadioButton;

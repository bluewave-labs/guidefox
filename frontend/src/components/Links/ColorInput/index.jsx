import PropTypes from 'prop-types';
import styles from './ColorInput.module.scss';

const ColorInput = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  title,
  className,
}) => (
  <label htmlFor="header-bg" className={styles.appearance__label}>
    {title}{' '}
    <div className={styles.appearance__color}>
      <span
        className={`${styles.appearance__input} ${styles[className]} ${
          error && styles.error
        }`}
      >
        {value}
      </span>
      <div className={styles.appearance__circle}>
        <input
          type="color"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <span
          className={styles['appearance__circle--mask']}
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  </label>
);

export default ColorInput;

ColorInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};

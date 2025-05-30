import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import styles from './PopupAppearance.module.scss';
import ColorTextField from '@components/ColorTextField/ColorTextField';
import DropdownList from '@components/DropdownList/DropdownList';
import { appearanceSchema } from '../../../../utils/popupHelper';

const PopupAppearance = React.forwardRef((props, ref) => {
  const { data = [], popupAppearance, setPopupAppearance, onSave } = props;
  return (
    <Formik
      innerRef={ref}
      initialValues={{
        ...popupAppearance,
      }}
      validationSchema={appearanceSchema}
      validateOnMount={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          onSave();
        } catch (error) {
          return;
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        validateField,
        setFieldValue,
      }) => (
        <Form className={styles.container}>
          {data.map(({ name, label }, key) => (
            <div key={key}>
              <h2>{label}</h2>
              <div className={styles.color}>
                <ColorTextField
                  name={name}
                  value={values[name]}
                  error={Boolean(touched[name] && errors[name])}
                  onChange={(val) => {
                    setFieldValue(name, val);
                    setPopupAppearance((prev) => ({ ...prev, [name]: val }));
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    validateField(name);
                  }}
                />
              </div>
              {Boolean(touched[name] && errors[name]) && (
                <small
                  className={styles['popup-appearance-error']}
                  aria-live="polite"
                >
                  {errors[name]}
                </small>
              )}
            </div>
          ))}

          <h2 style={{ marginBottom: 0 }}>Popup Size</h2>
          <DropdownList
            actions={['Small', 'Medium', 'Large']}
            onActionChange={(value) => {
              const normalizedValue = value.toLowerCase();
              setPopupAppearance((prev) => ({
                ...prev,
                popupSize: normalizedValue,
              }));
              setFieldValue('popupSize', normalizedValue);
            }}
            selectedActionString={values.popupSize}
          />
        </Form>
      )}
    </Formik>
  );
});

export default PopupAppearance;

PopupAppearance.displayName = 'PopupAppearance';

PopupAppearance.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  popupAppearance: PropTypes.object.isRequired,
  setPopupAppearance: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

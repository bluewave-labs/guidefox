import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import styles from './TourLeftAppearance.module.scss';
import DropdownList from '@components/DropdownList/DropdownList';
import { appearanceSchema } from '../../../../utils/tourHelper';
import CustomTextField from '../../../../components/TextFieldComponents/CustomTextField/CustomTextField';
import ColorInput from '../../../../components/Links/ColorInput';

const TourLeftAppearance = React.forwardRef((props, ref) => {
  const {
    data = [],
    tourPopupAppearance,
    setTourPopupAppearance,
    onSave,
  } = props;
  return (
    <Formik
      innerRef={ref}
      initialValues={{
        ...tourPopupAppearance,
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
        handleChange,
        validateField,
        setFieldValue,
      }) => {
        const renderError = (field) =>
          Boolean(touched[field] && errors[field]) && (
            <small className={styles.error}>{errors[field]}</small>
          );

        return (
          <Form className={styles.container}>
            {data.map(({ name, label }, key) => (
              <div key={key} className={styles.color}>
                <ColorInput
                  onChange={(val) => {
                    setTourPopupAppearance((prev) => ({
                      ...prev,
                      [name]: val,
                    }));
                  }}
                  id={name}
                  name={name}
                  title={label}
                />
              </div>
            ))}
            <h2
              style={{
                marginTop: '0px',
              }}
            >
              Tour Size
            </h2>
            <DropdownList
              id="size"
              actions={['Small', 'Medium', 'Large']}
              styles={{
                marginTop: '10px',
                width: '206px',
                color: 'var(--main-text-color)',
              }}
              onActionChange={(value) => {
                const normalizedValue = value.toLowerCase();
                setFieldValue('size', normalizedValue);
                setTourPopupAppearance((prev) => ({
                  ...prev,
                  size: normalizedValue,
                }));
              }}
              selectedActionString={values.size?.toLowerCase()}
            />

            <CustomTextField
              TextFieldWidth="206px"
              id="finalButtonText"
              name="finalButtonText"
              error={!!errors['finalButtonText']}
              labelSubText="Final Button Text"
              labelTextStyles={{ color: 'var(--main-text-color)' }}
              value={values.finalButtonText}
              style={{
                marginTop: '1rem',
              }}
              inputStyles={{
                marginTop: '10px',
                marginBottom: '0px',
              }}
              onChange={(e) => {
                handleChange({
                  target: { name: 'finalButtonText', value: e.target.value },
                });
                setTourPopupAppearance((prev) => ({
                  ...prev,
                  finalButtonText: e.target.value,
                }));
              }}
              onBlur={(e) => {
                handleBlur(e);
                validateField('finalButtonText');
              }}
            />
            {renderError('finalButtonText')}

            <CustomTextField
              TextFieldWidth="206px"
              id="url"
              name="url"
              error={!!errors['url']}
              labelSubText="URL"
              labelTextStyles={{ color: 'var(--main-text-color)' }}
              value={values.url}
              style={{
                marginTop: '1rem',
              }}
              inputStyles={{
                marginTop: '10px',
                marginBottom: '0px',
              }}
              onChange={(e) => {
                handleChange({
                  target: { name: 'url', value: e.target.value },
                });
                setTourPopupAppearance((prev) => ({
                  ...prev,
                  url: e.target.value,
                }));
              }}
              onBlur={(e) => {
                handleBlur(e);
                validateField('url');
              }}
            />
            {renderError('url')}
          </Form>
        );
      }}
    </Formik>
  );
});

TourLeftAppearance.displayName = 'TourLeftAppearance';

TourLeftAppearance.propTypes = {
  data: PropTypes.array,
  tourPopupAppearance: PropTypes.object.isRequired,
  setTourPopupAppearance: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TourLeftAppearance;

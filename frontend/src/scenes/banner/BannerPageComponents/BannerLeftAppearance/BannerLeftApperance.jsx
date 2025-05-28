import React from 'react';
import PropTypes from 'prop-types';
import ColorTextField from '@components/ColorTextField/ColorTextField';
import { Formik, Form } from 'formik';
import { appearanceSchema } from '../../../../utils/bannerHelper';
import styles from './BannerLeftAppearance.module.css';

const BannerLeftAppearance = React.forwardRef((props, ref) => {
  const { backgroundColor, setBackgroundColor, fontColor, setFontColor } =
    props;
  return (
    <Formik
      innerRef={ref}
      initialValues={{ backgroundColor, fontColor }}
      validationSchema={appearanceSchema}
      validateOnBlur={false}
      validateOnMount={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          onSave();
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, values, setFieldValue }) => (
        <Form className={styles.bannerAppearanceContainer}>
          <div className={styles.bannerAppearanceItem}>
            <h2 className={styles.bannerStateName}>Background Color</h2>
            <div className={styles.bannerAppearanceColor}>
              <ColorTextField
                value={values.backgroundColor}
                name="backgroundColor"
                onChange={(val) => {
                  setFieldValue('backgroundColor', val);
                  setBackgroundColor(val);
                }}
                onBlur={handleBlur}
                error={errors.backgroundColor}
              />
            </div>
            {errors.backgroundColor && (
              <small className={styles.bannerAppearanceError}>
                {errors.backgroundColor}
              </small>
            )}

            <h2 className={styles.bannerStateName}>Font Color</h2>
            <div className={styles.bannerAppearanceColor}>
              <ColorTextField
                value={values.fontColor}
                name="fontColor"
                onChange={(val) => {
                  setFieldValue('fontColor', val);
                  setFontColor(val);
                }}
                onBlur={handleBlur}
                error={errors.fontColor}
              />
            </div>
            {errors.fontColor && (
              <small className={styles.bannerAppearanceError}>
                {errors.fontColor}
              </small>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
});

BannerLeftAppearance.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  setBackgroundColor: PropTypes.func.isRequired,
  fontColor: PropTypes.string.isRequired,
  setFontColor: PropTypes.func.isRequired,
};

BannerLeftAppearance.displayName = 'BannerLeftAppearance';

export default BannerLeftAppearance;

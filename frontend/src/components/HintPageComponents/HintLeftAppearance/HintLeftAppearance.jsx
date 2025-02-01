import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { appearanceSchema } from '../../../utils/hintHelper';
import ColorTextField from '../../ColorTextField/ColorTextField';
import './HintLeftAppearance.css';

const mapState = {
  headerBackgroundColor: 'Header Background Color',
  headerColor: 'Header Color',
  textColor: 'Text Color',
  buttonBackgroundColor: 'Button Background Color',
  buttonTextColor: 'Button Text Color',
};

const HintLeftAppearance = ({ data = {}, setState, onSave }) => {
  const content = useMemo(() => {
    if (Object.values(data).every((state) => state === null)) {
      return <div className="hint-appearance-container">No data available</div>;
    }

    return (
      <Formik
        initialValues={data}
        validationSchema={appearanceSchema}
        validateOnMount={false}
        validateOnBlur={false}
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
        {({ errors, handleChange, handleBlur, values, validateField }) => (
          <Form className="hint-appearance-container">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="hint-appearance-item">
                <h2 className="hint-state-name">{mapState[key]}</h2>
                <div className="hint-appearance-color">
                  <ColorTextField
                    value={values[key]}
                    onChange={(val) => {
                      handleChange({ target: { name: key, value: val } });
                      setState((prev) => ({ ...prev, [key]: val }));
                    }}
                    onBlur={(e) => {
                      handleBlur(e);
                      validateField(key);
                    }}
                    error={!!errors[key]}
                  />
                </div>
                {errors[key] && (
                  <small className="hint-appearance-error">{errors[key]}</small>
                )}
              </div>
            ))}
          </Form>
        )}
      </Formik>
    );
  }, [data]);

  return content;
};

export default HintLeftAppearance;

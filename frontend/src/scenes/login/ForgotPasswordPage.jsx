import React, { useState } from 'react';
import styles from './Login.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { forgotPassword } from '../../services/loginServices';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/TextFieldComponents/CustomTextField/CustomTextField';
import CircularProgress from '@mui/material/CircularProgress';
import Logo from '../../components/Logo/Logo';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    )
    .required('Email is required')
    .trim(),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState('');
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={async (values, { setSubmitting }) => {
        setServerErrors([]);
        try {
          await forgotPassword(values);
          navigate('/check-email', { state: { values } });
        } catch (error) {
          setServerErrors(error.response?.data?.error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        isSubmitting,
        touched,
        errors,
        handleChange,
        handleBlur,
        values,
      }) => (
        <Form className={styles['login-container']}>
          <Logo />
          <h2 style={{ marginBottom: '0px' }}>Forgot password?</h2>
          <h3>No worries, we&apos;ll send you reset instructions.</h3>
          <div className={styles['form-group']}>
            <CustomTextField
              id="email"
              name="email"
              type="email"
              labelText="Email"
              checkCircleIconVisible={true}
              displayCheckCircleIcon={touched.email && !errors.email}
              placeholder="Enter your email"
              textFieldMargin="none"
              TextFieldWidth="full"
              required={true}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            {serverErrors.length > 0 && (
              <div className={styles['error-message']}>{serverErrors}</div>
            )}
          </div>
          <button
            style={{ marginTop: '0px' }}
            className={styles['reset-password-button']}
          >
            {isSubmitting ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              'Reset password'
            )}
          </button>
          <button
            className={styles['back-to-login-button']}
            type="submit"
            disabled={isSubmitting}
            onClick={() => navigate('/')}
          >
            <ArrowBackIcon style={{ fontSize: '18px', marginRight: '5px' }} />
            Back to log in
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordPage;

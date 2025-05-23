import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { resetPassword } from '../../services/loginServices';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

function SetNewPasswordPage() {
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /[!@#$%^&*(),.?":{}|<>_\-=]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setServerErrors([]);
        try {
          await resetPassword({
            token: token,
            newPassword: values.password,
          });
          resetForm();
          navigate('/reset-password');
        } catch (error) {
          console.error('Password Reset failed:', error);
          if (error.response?.data?.errors) {
            setServerErrors(error.response?.data?.errors);
          } else if (error.response?.data?.error) {
            setServerErrors([error.response.data.error]);
          } else {
            setServerErrors(['An error occurred. Please try again.']);
          }
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
          <h2 style={{ marginBottom: '0px' }}>Set new Password</h2>
          <h3>
            Your new password must be different from previously used passwords.
          </h3>
          <div className={styles['form-group']}>
            <CustomTextField
              id="password"
              type="password"
              name="password"
              labelText="Password*:"
              checkCircleIconVisible={true}
              displayCheckCircleIcon={touched.password && !errors.password}
              placeholder="Create your password"
              textFieldMargin="none"
              TextFieldWidth="full"
              required={true}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </div>
          <div
            className={styles['form-group']}
            style={{ marginBottom: '10px' }}
          >
            <CustomTextField
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              labelText="Confirm Password*:"
              checkCircleIconVisible={true}
              displayCheckCircleIcon={
                touched.confirmPassword &&
                !errors.confirmPassword &&
                values.password === values.confirmPassword
              }
              placeholder="Confirm your password"
              textFieldMargin="none"
              TextFieldWidth="full"
              required={true}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
            {serverErrors.length > 0 && (
              <div className={styles['error-message']}>
                {serverErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className={styles['password-constraints']}>
            <CheckCircleIcon
              style={{
                color:
                  values.password.length >= 8
                    ? 'green'
                    : 'var(--light-border-color)',
                fontSize: '20px',
                marginRight: '5px',
              }}
            />
            Must be at least 8 characters
          </div>
          <div className={styles['password-constraints']}>
            <CheckCircleIcon
              style={{
                color: /[!@#$%^&*(),.?":{}|<>_\-=]/.test(values.password)
                  ? 'green'
                  : 'var(--light-border-color)',
                fontSize: '20px',
                marginRight: '5px',
              }}
            />
            Must contain one special character
          </div>
          <button
            type="submit"
            className={styles['sign-in-button']}
            style={{ marginTop: '15px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={styles['back-to-login-button']}
          >
            {' '}
            <ArrowBackIcon style={{ fontSize: '18px', marginRight: '5px' }} />
            Back to log in
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default SetNewPasswordPage;

import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styles from "./Login.module.css";
import CustomTextField from "../../components/TextFieldComponents/CustomTextField/CustomTextField";
import CircularProgress from "@mui/material/CircularProgress";
import { login } from "../../services/loginServices";
import CustomLink from "../../components/CustomLink/CustomLink";
import { handleAuthSuccess } from "../../utils/loginHelper";
import { useAuth } from "../../services/authProvider";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";

function LoginPage({ isAdmin = false }) {
  const { loginAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const values = {
    "email": "bluewaveguidefox@gmail.com",
    "password": "Bluewave@1234!"
  }

  const handleLogin = async () => {
    setIsSubmitting(true);
    const response = await login(values);
    handleAuthSuccess(response, loginAuth, navigate);
    setIsSubmitting(false);
  }

  return (
    <div className={styles["login-container"]}>
      <Logo />
      <h2>Log in to your account</h2>
      <button
        className={styles["sign-in-button"]}
        onClick={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          "Sign In"
        )}
      </button>
    </div>
  );
}

export default LoginPage;

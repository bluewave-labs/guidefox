import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { lightTheme } from './assets/theme';
import { ThemeProvider } from '@mui/material';
import { AuthProvider } from './services/authProvider.jsx';
import { GuideTemplateProvider } from './templates/GuideTemplate/GuideTemplateContext';
import Toast from '@components/Toast/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <AuthProvider>
        <GuideTemplateProvider>
          <Router>
            <App />
            <Toast />
          </Router>
        </GuideTemplateProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

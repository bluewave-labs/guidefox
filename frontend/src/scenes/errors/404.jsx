import React from 'react';
import { ErrorComponent } from './Error';
import { NAVIGATE_404_URL, TEXT_404 } from './constant';
import { useNavigate } from 'react-router';

export const Error404 = () => {
  const navigate = useNavigate();

  return (
    <ErrorComponent
      text={TEXT_404}
      errorAction={() => navigate(NAVIGATE_404_URL)}
    />
  );
};

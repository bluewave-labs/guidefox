import React from 'react';
import { ErrorComponent } from './Error';
import { NAVIGATE_403_URL, TEXT_403 } from './constant';
import { useNavigate } from 'react-router-dom';

export const Error403 = () => {
  const navigate = useNavigate();

  return (
    <ErrorComponent
      text={TEXT_403}
      errorAction={() => navigate(NAVIGATE_403_URL)}
    />
  );
};

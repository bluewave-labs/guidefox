import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return <footer>©{currentYear} BlueWave labs Onboarding application</footer>;
};

export default Footer;

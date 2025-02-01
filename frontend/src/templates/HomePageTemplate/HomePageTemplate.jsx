import React from 'react';
import LeftMenu from '@components/LeftMenu/LeftMenu';
import './HomePageTemplate.css';
import { Outlet } from 'react-router-dom';

const HomePageTemplate = () => {
  return (
    <div className="container">
      <div className="content-container">
        <LeftMenu className="sidebar" />
        <Outlet />
      </div>
    </div>
  );
};

export default HomePageTemplate;

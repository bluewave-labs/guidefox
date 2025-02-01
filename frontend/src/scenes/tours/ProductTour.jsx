import React, { useState, useEffect } from 'react';
import List from '../../templates/GuideMainPageTemplate/GuideMainPageComponents/List/List';
import ContentArea from '../../templates/GuideMainPageTemplate/GuideMainPageComponents/ContentArea/ContentArea';
import ConfirmationPopup from '../../templates/GuideMainPageTemplate/GuideMainPageComponents/ConfirmationPopup/ConfirmationPopup';
import Button from '@components/Button/Button';
import './ProductTourStyles.css';
import CreateToursPopup from './CreateToursPopup/CreateToursPopup';
import PropTypes from 'prop-types';

const TourPage = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showDemoItems, setShowDemoItems] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // New state for showing settings

  useEffect(() => {
    setShowDemoItems(items.length === 0);
  }, [items]);

  const handleSelect = (idItem) => {
    setSelectedItem(idItem);
  };

  const handleDelete = () => {
    setPopupOpen(false);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings); // Toggle the settings visibility
  };

  const demoItems = [
    {
      title: 'Main dashboard - first login tour',
      timestamp: '10:00 AM',
      idItem: '12548',
      text: 'This pops up the first time the user logins to the dashboard.',
      onDelete: () => {},
      onEdit: () => {},
    },
  ];

  const listItems = (showDemoItems ? demoItems : items).flatMap((item) =>
    Array(3).fill(item)
  );

  return (
    <div className="product-page-container">
      <div className="product-page-header">
        <h2 style={{ marginTop: '0.3rem' }}>
          {showDemoItems ? 'Demo Tours' : 'All Tours'}
        </h2>
        <Button text="Create a new tour" onClick={toggleSettings} />{' '}
        {/* Button action */}
      </div>
      <div className="product-page">
        <ContentArea className="content-area">
          <List items={listItems} onSelectItem={handleSelect} />
        </ContentArea>
        <div className="tour-info-container">
          <h4>What is a product tour?</h4>
          <p>
            A product onboarding tour is a guided walkthrough or tutorial that
            introduces users to a new product or service. It typically occurs
            when a user first signs up or logs into the product. The purpose of
            the onboarding tour is to familiarize users with the key features,
            functionalities, and benefits of the product in order to enhance
            their understanding. During the onboarding tour, users are typically
            shown around the interface, given demonstrations of how to perform
            key tasks, and provided with explanations of important features.
          </p>
        </div>
      </div>

      {/* Settings Component - Position and Animation */}
      {showSettings && (
        <div className="settings-container">
          <CreateToursPopup onClose={toggleSettings} />
        </div>
      )}

      <ConfirmationPopup
        open={isPopupOpen}
        onConfirm={handleDelete}
        onCancel={handleClosePopup}
      />
    </div>
  );
};

TourPage.propTypes = {
  items: PropTypes.array,
};

export default TourPage;

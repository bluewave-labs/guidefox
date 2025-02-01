import React from 'react';
import List from './GuideMainPageComponents/List/List';
import ContentArea from './GuideMainPageComponents/ContentArea/ContentArea';
import ContentHeader from './GuideMainPageComponents/ContentHeader/ContentHeader';
import ConfirmationPopup from './GuideMainPageComponents/ConfirmationPopup/ConfirmationPopup';
import Button from '@components/Button/Button';
import './GuideMainPageTemplate.css';
import { activityInfoData } from '../../data/guideMainPageData';
import { useAuth } from '../../services/authProvider';
import { renderIfAuthorized } from '../../utils/generalHelper';
import PropTypes from 'prop-types';

const GuideMainPageTemplate = ({
  items,
  handleDelete,
  isPopupOpen,
  handleClosePopup,
  type,
  onClick,
}) => {
  const { userInfo } = useAuth();
  const role = userInfo.role;
  const { heading, paragraph, buttonText, title } = activityInfoData[type];

  return (
    <div className="product-page-container">
      <div className="product-page-header">
        <ContentHeader title={title} />
        {renderIfAuthorized(
          role,
          'admin',
          <Button text={buttonText} onClick={onClick} />
        )}
      </div>
      <div className="product-page">
        <ContentArea className="content-area">
          <List items={items} />
        </ContentArea>
        <div className="tour-info-container">
          <h4>{heading}</h4>
          <p
            dangerouslySetInnerHTML={{
              __html: paragraph.replace(/\n/g, '</p><p>'),
            }}
          ></p>
        </div>
      </div>
      <ConfirmationPopup
        open={isPopupOpen}
        onConfirm={handleDelete}
        onCancel={handleClosePopup}
      />
    </div>
  );
};

GuideMainPageTemplate.propTypes = {
  items: PropTypes.array,
  handleDelete: PropTypes.func,
  isPopupOpen: PropTypes.bool,
  handleClosePopup: PropTypes.func,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default GuideMainPageTemplate;

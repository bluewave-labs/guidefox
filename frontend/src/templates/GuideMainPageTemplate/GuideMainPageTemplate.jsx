import React, { useState } from 'react';
import List from './GuideMainPageComponents/List/List';
import ContentArea from './GuideMainPageComponents/ContentArea/ContentArea';
import ContentHeader from './GuideMainPageComponents/ContentHeader/ContentHeader';
import ConfirmationPopup from './GuideMainPageComponents/ConfirmationPopup/ConfirmationPopup';
import Button from '@components/Button/Button';
import './GuideMainPageTemplate.css';
import { activityInfoData } from '../../data/guideMainPageData';
import { useAuth } from '../../services/authProvider';
import { renderIfAuthorized } from '../../utils/generalHelper';
import PaginationTable from '../../components/Pagination/TablePagination/PaginationTable';
import LoadingArea from '../../components/LoadingPage/LoadingArea';
import PropTypes from 'prop-types';

const GuideMainPageTemplate = ({
  items,
  count,
  handleDelete,
  isPopupOpen,
  handleClosePopup,
  type,
  onClick,
  loading,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
        {loading ? (
          <LoadingArea />
        ) : (
          <>
            <ContentArea className="content-area">
              {(rowsPerPage > 0
                ? items.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : items
              ).map((row, index) => (
                <List key={index} items={[row]} />
              ))}
              {count > 5 && (
                <PaginationTable
                  component="div"
                  count={count}
                  page={page}
                  setPage={setPage}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage={'Items per page'}
                  setRowsPerPage={setRowsPerPage}
                  onRowsPerPageChange={setRowsPerPage}
                  items={items}
                />
              )}
            </ContentArea>
            <div
              className="tour-info-container"
              style={{ maxWidth: 'fit-content' }}
            >
              <h4>{heading}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(/\n/g, '</p><p>'),
                }}
              ></p>
            </div>
          </>
        )}
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
  loading: PropTypes.bool,
  count: PropTypes.number,
};

export default GuideMainPageTemplate;

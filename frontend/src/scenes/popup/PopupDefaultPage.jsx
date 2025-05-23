import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
import CreatePopupPage from './CreatePopupPage';
import {
  addPopup,
  getPopupById,
  getPopups,
  deletePopup,
} from '../../services/popupServices';
import { ACTIVITY_TYPES_INFO } from '../../data/guideMainPageData';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';

const PopupDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const { state } = useLocation();

  const { isOpen } = useDialog();

  const getPopupDetails = (popup) => ({
    title: `Popup ${popup.id}`,
    text: popup.header,
  });

  return (
    <>
      <DefaultPageTemplate
        getItems={getPopups}
        deleteItem={deletePopup}
        setIsEdit={setIsEdit}
        setItemId={setItemId}
        itemType={ACTIVITY_TYPES_INFO.POPUPS}
        itemTypeInfo={ACTIVITY_TYPES_INFO.POPUPS}
        getItemDetails={getPopupDetails}
        itemsUpdated={itemsUpdated}
        getItemById={getPopupById}
        duplicateItem={addPopup}
      />
      {(isOpen || state?.autoOpen) && (
        <CreatePopupPage
          autoOpen={state?.autoOpen}
          isEdit={isEdit}
          itemId={itemId}
          setItemsUpdated={setItemsUpdated}
          setIsEdit={setIsEdit}
        />
      )}
    </>
  );
};

export default PopupDefaultPage;

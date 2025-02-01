import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ParagraphCSS from '@components/ParagraphCSS/ParagraphCSS';
import GuideMainPageTemplate from '../GuideMainPageTemplate/GuideMainPageTemplate';
import CreateActivityButton from '@components/Button/CreateActivityButton/CreateActivityButton';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import './DefaultPageTemplate.css';
import { useAuth } from '../../services/authProvider';
import { renderIfAuthorized } from '../../utils/generalHelper';
import { useDialog } from '../GuideTemplate/GuideTemplateContext';

const DefaultPageTemplate = ({
  getItems,
  deleteItem,
  setIsEdit,
  setItemId,
  itemType,
  itemTypeInfo,
  getItemDetails,
  itemsUpdated,
  getItemById,
  duplicateItem,
}) => {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();
  const [itemDeleted, setItemDeleted] = useState(false);
  const [itemsDuplicated, setItemsDuplicated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const { userInfo } = useAuth();
  const { openDialog } = useDialog();

  const role = userInfo.role;

  const openEditPopupDialog = (id) => {
    setIsEdit(true);
    setItemId(id);
    openDialog();
  };

  const openNewPopupDialog = () => {
    setIsEdit(false);
    setItemId(null);
    openDialog();
  };

  const handleDelete = async () => {
    try {
      await deleteItem(itemToDelete);
      setPopupOpen(false);
      if (items.length > 1) {
        setLoad(false);
      }
      setItemDeleted((prevState) => !prevState);
      toastEmitter.emit(
        TOAST_EMITTER_KEY,
        `This ${itemType.slice(0, -1)} is removed`
      );
    } catch (error) {
      toastEmitter.emit(
        TOAST_EMITTER_KEY,
        `Failed to remove this ${itemType.slice(0, -1)}`
      );
    }
  };

  const duplicateHandler = async (id) => {
    try {
      if (itemType === 'helper links') {
        const {
          // eslint-disable-next-line no-unused-vars
          createdBy,
          id: fetchedId,
          links,
          ...helper
        } = await getItemById(id);
        const updatedLinks = links.map(({ id, ...data }) => data);

        await duplicateItem(helper, updatedLinks);
      } else {
        // eslint-disable-next-line no-unused-vars
        const { createdBy, id: fetchedId, ...data } = await getItemById(id);
        await duplicateItem(data);
      }

      toastEmitter.emit(
        TOAST_EMITTER_KEY,
        `${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)} duplicated successfully`
      );

      setItemsDuplicated((prev) => !prev);
    } catch (error) {
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : 'An unexpected error occurred. Please try again.';
      toastEmitter.emit(TOAST_EMITTER_KEY, errorMessage);
    }
  };

  const handleOpenPopup = (id) => {
    setItemToDelete(id);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setIsEdit(false);
    setItemId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (load) {
          setLoading(true);
        }
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${itemType.toLowerCase()}s:`, error);
      } finally {
        setLoading(false);
        setLoad(true);
      }
    };
    fetchData();
  }, [itemDeleted, itemsUpdated, itemsDuplicated]);

  const mappedItems = useMemo(
    () =>
      items.map((item) => ({
        idItem: item.id,
        ...getItemDetails(item),
        onDelete: () => handleOpenPopup(item.id),
        onEdit: () => openEditPopupDialog(item.id),
        onDuplicate: () => duplicateHandler(item.id),
      })),
    [
      items,
      getItemDetails,
      handleOpenPopup,
      openNewPopupDialog,
      duplicateHandler,
    ]
  );

  return (
    <>
      {loading ? (
        <div />
      ) : (
        <div className={`fade-in`}>
          {items.length === 0 ? (
            <div className={'placeholder-style'}>
              {renderIfAuthorized(role, 'admin', <ParagraphCSS />)}
              {renderIfAuthorized(
                role,
                'admin',
                <CreateActivityButton
                  type={itemType}
                  onClick={openNewPopupDialog}
                />
              )}
            </div>
          ) : (
            <GuideMainPageTemplate
              items={mappedItems}
              handleDelete={handleDelete}
              isPopupOpen={isPopupOpen}
              handleClosePopup={handleClosePopup}
              type={itemTypeInfo}
              onClick={openNewPopupDialog}
            />
          )}
        </div>
      )}
    </>
  );
};

DefaultPageTemplate.propTypes = {
  getItems: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  getItemById: PropTypes.func.isRequired,
  itemsUpdated: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setItemId: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  itemTypeInfo: PropTypes.string.isRequired,
  getItemDetails: PropTypes.func.isRequired,
  duplicateItem: PropTypes.func.isRequired,
};

export default DefaultPageTemplate;

import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import ParagraphCSS from "@components/ParagraphCSS/ParagraphCSS";
import GuideMainPageTemplate from "../GuideMainPageTemplate/GuideMainPageTemplate";
import CreateActivityButton from "@components/Button/CreateActivityButton/CreateActivityButton";
import toastEmitter, { TOAST_EMITTER_KEY } from "../../utils/toastEmitter";
import "./DefaultPageTemplate.css";
import { useAuth } from "../../services/authProvider";
import { renderIfAuthorized } from "../../utils/generalHelper";

const DefaultPageTemplate = ({
  getItems,
  deleteItem,
  navigateToCreate,
  itemType,
  itemTypeInfo,
  getItemDetails,
}) => {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();
  const [itemDeleted, setItemDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const { userInfo } = useAuth();
  const role = userInfo.role;

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

  const handleOpenPopup = (id) => {
    setItemToDelete(id);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (load) {
          setLoading(true);
        }
        const response = await getItems();
        const data = response.data
        setItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${itemType.toLowerCase()}s:`, error);
        setItems([]);
      } finally {
        setLoading(false);
        setLoad(true);
      }
    };
    fetchData();
  }, [itemDeleted]);

  const mappedItems = useMemo(
    () =>
      items.map((item) => ({
        idItem: item.id,
        ...getItemDetails(item),
        onDelete: () => handleOpenPopup(item.id),
        onEdit: () =>
          navigateToCreate({ state: { isEdit: true, id: item.id } }),
      })),
    [items, getItemDetails, handleOpenPopup, navigateToCreate]
  );

  return (
    <>
      {loading ? (
        <div />
      ) : (
        <div className={`fade-in`}>
          {items.length === 0 ? (
            <div className={"placeholder-style"}>
              {renderIfAuthorized(role, "admin", <ParagraphCSS />)}
              {renderIfAuthorized(
                role,
                "admin",
                <CreateActivityButton
                  type={itemType}
                  onClick={navigateToCreate}
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
              onClick={navigateToCreate}
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
  navigateToCreate: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  itemTypeInfo: PropTypes.string.isRequired,
  getItemDetails: PropTypes.func.isRequired,
};

export default DefaultPageTemplate;

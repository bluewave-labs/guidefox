import React, { useState } from "react";
import { useLocation } from "react-router-dom"
import { ACTIVITY_TYPES_INFO } from "../../data/guideMainPageData";
import { createHelper, getHelperById, deleteHelper, getHelpers } from "../../services/helperLinkService";
import HelperLinkProvider from "../../services/linksProvider";
import DefaultPageTemplate from "../../templates/DefaultPageTemplate/DefaultPageTemplate";
import { useDialog } from "../../templates/GuideTemplate/GuideTemplateContext";
import styles from "./LinkPage.module.scss";
import NewLinksPopup from "./NewLinksPopup";

const LinksDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const { state } = useLocation();

  const { isOpen } = useDialog();

  const getItemDetails = (helper) => ({
    title: helper.title,
    headerBackgroundColor: helper.headerBackgroundColor,
    linkFontColor: helper.linkFontColor,
    iconColor: helper.iconColor,
    url: helper.url,
    active: helper.active,
    absolutePath: helper.absolutePath,
  });

  return (
    <HelperLinkProvider>
      <div className={styles.container}>
        {(isOpen || state?.autoOpen) && (
          <NewLinksPopup
            autoOpen={state?.autoOpen}
            isEdit={isEdit}
            itemId={itemId}
            setItemsUpdated={setItemsUpdated}
            setIsEdit={setIsEdit}
          />
        )}
        <DefaultPageTemplate
          getItems={getHelpers}
          deleteItem={deleteHelper}
          itemsUpdated={itemsUpdated}
          setIsEdit={setIsEdit}
          setItemId={setItemId}
          itemType={ACTIVITY_TYPES_INFO.HELPERLINKS}
          itemTypeInfo={ACTIVITY_TYPES_INFO.HELPERLINKS}
          getItemDetails={getItemDetails}
          getItemById={getHelperById}
          duplicateItem={createHelper}
        />
      </div>
    </HelperLinkProvider>
  );
};

export default LinksDefaultPage;

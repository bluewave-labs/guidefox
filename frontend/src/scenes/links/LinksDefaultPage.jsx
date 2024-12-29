import React, { useState } from "react";
import { ACTIVITY_TYPES_INFO } from "../../data/guideMainPageData";
import { deleteHelper, getHelpers } from "../../services/helperLinkService";
import HelperLinkProvider from "../../services/linksProvider";
import DefaultPageTemplate from "../../templates/DefaultPageTemplate/DefaultPageTemplate";
import { useDialog } from "../../templates/GuideTemplate/GuideTemplateContext";
import styles from "./LinkPage.module.scss";
import NewLinksPopup from "./NewLinksPopup";

const LinksDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);

  const { isOpen } = useDialog();

  const getItemDetails = (helper) => ({
    title: helper.title,
    headerBackgroundColor: helper.headerBackgroundColor,
    linkFontColor: helper.linkFontColor,
    iconColor: helper.iconColor,
  });

  return (
    <HelperLinkProvider>
      <div className={styles.container}>
        {isOpen && (
          <NewLinksPopup
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
        />
      </div>
    </HelperLinkProvider>
  );
};

export default LinksDefaultPage;

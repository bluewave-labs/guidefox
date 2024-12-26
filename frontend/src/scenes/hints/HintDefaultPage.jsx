import React, { useState } from "react";
import {useLocation} from "react-router-dom"
import DefaultPageTemplate from "../../templates/DefaultPageTemplate/DefaultPageTemplate";
import CreateHintPage from "./CreateHintPage";
import { ACTIVITY_TYPES_INFO } from "../../data/guideMainPageData";
import { getHints, deleteHint } from '../../services/hintServices';

const HintDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const locationData = useLocation()

  const getHintDetails = (hint) => ({
    title: `Hint ${hint.id}`,
    text: hint.header,
  });
  
  return (
    <>
      <DefaultPageTemplate
        getItems={getHints}
        deleteItem={deleteHint}
        setIsEdit={setIsEdit}
        setItemId={setItemId}
        itemType={ACTIVITY_TYPES_INFO.HINTS}
        itemTypeInfo={ACTIVITY_TYPES_INFO.HINTS}
        getItemDetails={getHintDetails}
        itemsUpdated={itemsUpdated}
      />
      <CreateHintPage
        autoOpen={locationData.state?.autoOpen}
        isEdit={isEdit}
        itemId={itemId}
        setItemsUpdated={setItemsUpdated}
      />
    </>
  );
};

export default HintDefaultPage;

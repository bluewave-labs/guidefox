import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
import CreateHintPage from './CreateHintPage';
import { ACTIVITY_TYPES_INFO } from '../../data/guideMainPageData';
import {
  addHint,
  getHintById,
  getHints,
  deleteHint,
} from '../../services/hintServices';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';

const HintDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const { state } = useLocation();
  const { isOpen } = useDialog();

  const params = new URLSearchParams(window.location.search);
  const autoOpen = params.get('autoOpen') === 'true';

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
        getItemById={getHintById}
        duplicateItem={addHint}
      />
      {(isOpen || state?.autoOpen || autoOpen) && (
        <CreateHintPage
          autoOpen={state?.autoOpen || autoOpen}
          isEdit={isEdit}
          itemId={itemId}
          setItemsUpdated={setItemsUpdated}
          setIsEdit={setIsEdit}
        />
      )}
    </>
  );
};

export default HintDefaultPage;

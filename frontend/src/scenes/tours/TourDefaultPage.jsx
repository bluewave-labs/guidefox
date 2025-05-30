import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
import {
  addTour,
  getTourById,
  getTours,
  deleteTour,
} from '../../services/tourServices';
import { ACTIVITY_TYPES_INFO } from '../../data/guideMainPageData';
import TourPage from './CreateTourPage';

const TourDefaultPage = () => {
  const [itemsUpdated, setItemsUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const { state } = useLocation();
  const { isOpen } = useDialog();

  const params = new URLSearchParams(window.location.search);
  const autoOpen = params.get('autoOpen') === 'true';

  const getTourDetails = (tour) => ({
    title: `Tour ${tour.id}`,
    text: tour.name,
  });

  return (
    <>
      <DefaultPageTemplate
        getItems={getTours}
        deleteItem={deleteTour}
        setIsEdit={setIsEdit}
        setItemId={setItemId}
        itemType={ACTIVITY_TYPES_INFO.TOURS}
        itemTypeInfo={ACTIVITY_TYPES_INFO.TOURS}
        getItemDetails={getTourDetails}
        itemsUpdated={itemsUpdated}
        getItemById={getTourById}
        duplicateItem={addTour}
      />
      {(isOpen || state?.autoOpen || autoOpen) && (
        <TourPage
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

export default TourDefaultPage;

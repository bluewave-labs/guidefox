import React, { useState } from 'react';
import CreateActivityButton from '@components/Button/CreateActivityButton/CreateActivityButton';
import { ACTIVITY_TYPES } from '../../data/createActivityButtonData';
import ParagraphCSS from '@components/ParagraphCSS/ParagraphCSS';
import TourPage from './ProductTour';

const ToursDefaultPage = () => {
  const [showTourPage, setShowTourPage] = useState(false);

  const handleButtonClick = () => {
    setShowTourPage(true);
  };

  const style = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <>
      {showTourPage ? (
        <TourPage items={[]} />
      ) : (
        <div style={style}>
          <ParagraphCSS />
          <CreateActivityButton
            type={ACTIVITY_TYPES.TOURS}
            onClick={handleButtonClick}
          />
        </div>
      )}
    </>
  );
};

export default ToursDefaultPage;

// import React from 'react';
// import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
// // import { getTours, deleteTour } from '../../services/tourServices';
// import { useNavigate } from 'react-router-dom';
// import { ACTIVITY_TYPES_INFO } from '../../data/GuideMainPageData';

// const TourDefaultPage = () => {
//     const navigate = useNavigate();

//     // const getTourDetails = (tour) => ({
//     //     title: `Tour ${tour.id}`,
//     //     text: tour.name,
//     // });

//     const navigateToCreate = (state) => {
//         navigate('/tour/create', state);
//     };

//     return (
//         <DefaultPageTemplate
//             getItems={getTours}
//             deleteItem={deleteTour}
//             navigateToCreate={navigateToCreate}
//             itemType={ACTIVITY_TYPES_INFO.BANNERS}
//             itemTypeInfo={ACTIVITY_TYPES_INFO.BANNERS}
//             getItemDetails={getTourDetails}
//         />
//     );
// };

// export default TourDefaultPage;

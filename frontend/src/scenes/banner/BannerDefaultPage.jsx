import React, { useState } from 'react';
import {useLocation} from "react-router-dom"
import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
import { getBanners, deleteBanner } from '../../services/bannerServices';
import { ACTIVITY_TYPES_INFO } from '../../data/guideMainPageData';
import BannerPage from './CreateBannerPage';

const BannerDefaultPage = () => {
    const [itemsUpdated, setItemsUpdated] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [itemId, setItemId] = useState(null);
    const locationData = useLocation()

    const getBannerDetails = (banner) => ({
        title: `Banner ${banner.id}`,
        text: banner.bannerText,
    });

    return (
        <>
            <DefaultPageTemplate
                getItems={getBanners}
                deleteItem={deleteBanner}
                setIsEdit={setIsEdit}
                setItemId={setItemId}
                itemType={ACTIVITY_TYPES_INFO.BANNERS}
                itemTypeInfo={ACTIVITY_TYPES_INFO.BANNERS}
                getItemDetails={getBannerDetails}
                itemsUpdated={itemsUpdated}
            />
            <BannerPage
                autoOpen= {locationData.state?.autoOpen}
                isEdit={isEdit}
                itemId={itemId}
                setItemsUpdated={setItemsUpdated}
            />
        </>
    );
};

export default BannerDefaultPage;

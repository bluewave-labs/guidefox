import { React, useEffect, useState } from "react";
import {
  addBanner,
  editBanner,
  getBannerById,
} from "../../services/bannerServices";
import GuideTemplate from "../../templates/GuideTemplate/GuideTemplate";
import { emitToastError } from "../../utils/guideHelper";
import toastEmitter, { TOAST_EMITTER_KEY } from "../../utils/toastEmitter";
import BannerLeftAppearance from "./BannerPageComponents/BannerLeftAppearance/BannerLeftApperance";
import BannerLeftContent from "./BannerPageComponents/BannerLeftContent/BannerLeftContent";
import BannerPreview from "./BannerPageComponents/BannerPreview/BannerPreview";
import { useDialog } from "../../templates/GuideTemplate/GuideTemplateContext";

const BannerPage = ({ autoOpen = false, isEdit, itemId, setItemsUpdated, setIsEdit }) => {
  const [backgroundColor, setBackgroundColor] = useState("#F9F5FF");
  const [fontColor, setFontColor] = useState("#344054");
  const [activeButton, setActiveButton] = useState(0);
  const [isTopPosition, setIsTopPosition] = useState(true);
  const [bannerText, setBannerText] = useState("");
  const [url, setUrl] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [buttonAction, setButtonAction] = useState("No action");
  const { openDialog, closeDialog } = useDialog();

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };


  useEffect(() => {
    if (autoOpen) openDialog();
  }, [autoOpen, openDialog]);

  useEffect(() => {
    if (isEdit) {
      const fetchBannerData = async () => {
        try {
          const bannerData = await getBannerById(itemId);

          // Update the state with the fetched data
          setBackgroundColor(bannerData.backgroundColor || "#F9F5FF");
          setFontColor(bannerData.fontColor || "#344054");
          setBannerText(bannerData.bannerText || "");
          setUrl(bannerData.url || "");
          setActionUrl(bannerData.actionUrl || "");
          setButtonAction(bannerData.closeButtonAction || "No action");
          setIsTopPosition(bannerData.position === "top");
        } catch (error) {
          emitToastError(error);
        }
      };

      fetchBannerData();
    }
  }, [isEdit, itemId]);

  const onSave = async () => {
    const bannerData = {
      backgroundColor,
      fontColor,
      url,
      actionUrl,
      position: isTopPosition ? "top" : "bottom",
      closeButtonAction: buttonAction.toLowerCase(),
      bannerText,
    };
    try {
      const response = isEdit
        ? await editBanner(itemId, bannerData)
        : await addBanner(bannerData);
      const toastMessage = isEdit
        ? "You edited this banner"
        : "New banner saved";
      toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
      setItemsUpdated(prevState => !prevState);
      closeDialog();
    } catch (error) {
      emitToastError(error);
    }
  };

  return (
    <GuideTemplate
      title={isEdit ? "Edit Banner" : "New Banner"}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
      onSave={onSave}
      setIsEdit={setIsEdit}
      rightContent={() => (
        <BannerPreview
          backgroundColor={backgroundColor}
          color={fontColor}
          isTopPosition={isTopPosition}
          bannerText={bannerText}
          setBannerText={setBannerText}
        />
      )}
      leftContent={() => (
        <BannerLeftContent
          setIsTopPosition={setIsTopPosition}
          isTopPosition={isTopPosition}
          url={url}
          setUrl={setUrl}
          setButtonAction={setButtonAction}
          buttonAction={buttonAction}
          actionUrl={actionUrl}
          setActionUrl={setActionUrl}
        />
      )}
      leftAppearance={() => (
        <BannerLeftAppearance
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          fontColor={fontColor}
          setFontColor={setFontColor}
        />
      )}
    />
  );
};

export default BannerPage;

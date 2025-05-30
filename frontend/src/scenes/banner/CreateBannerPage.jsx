import { React, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  addBanner,
  editBanner,
  getBannerById,
} from '../../services/bannerServices';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { emitToastError, onSaveTemplate } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import BannerLeftAppearance from './BannerPageComponents/BannerLeftAppearance/BannerLeftApperance';
import BannerLeftContent from './BannerPageComponents/BannerLeftContent/BannerLeftContent';
import BannerPreview from './BannerPageComponents/BannerPreview/BannerPreview';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { newBannerSchema, appearanceSchema } from '../../utils/bannerHelper';

const BannerPage = ({
  autoOpen = false,
  isEdit,
  itemId,
  setItemsUpdated,
  setIsEdit,
}) => {
  const [backgroundColor, setBackgroundColor] = useState('#F9F5FF');
  const [fontColor, setFontColor] = useState('#344054');
  const [activeButton, setActiveButton] = useState(0);
  const [isTopPosition, setIsTopPosition] = useState(true);
  const [bannerText, setBannerText] = useState('');
  const [url, setUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [buttonAction, setButtonAction] = useState('No action');
  const [buttonRepetition, setButtonRepetition] = useState('Show only once');
  const { openDialog, closeDialog } = useDialog();
  const formikRef = useRef(null);

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
          setBackgroundColor(bannerData.backgroundColor || '#F9F5FF');
          setFontColor(bannerData.fontColor || '#344054');
          setBannerText(bannerData.bannerText || '');
          setUrl(bannerData.url || '');
          setActionUrl(bannerData.actionUrl || '');
          setButtonAction(bannerData.closeButtonAction || 'No action');
          setButtonRepetition(bannerData.repetitionType || 'Show only once');
          setIsTopPosition(bannerData.position === 'top');
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
      position: isTopPosition ? 'top' : 'bottom',
      closeButtonAction: buttonAction.toLowerCase(),
      repetitionType: buttonRepetition.toLowerCase(),
      bannerText,
    };

    const appearanceKeys = ['backgroundColor', 'fontColor'];
    const fieldPriority = [
      'action',
      'url',
      'actionUrl',
      'backgroundColor',
      'fontColor',
    ];

    await onSaveTemplate({
      data: bannerData,
      schema: newBannerSchema.concat(appearanceSchema),
      formikRef,
      appearanceKeys,
      setActiveButton,
      fieldPriority,
      onSuccess: async () => {
        try {
          if (isEdit) {
            await editBanner(itemId, bannerData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'You edited this banner');
          } else {
            await addBanner(bannerData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'New banner saved');
          }
          setItemsUpdated((prev) => !prev);
          closeDialog();
        } catch (error) {
          console.error('Error saving banner:', error);
          emitToastError(error);
        }
      },
    });
  };

  return (
    <GuideTemplate
      title={isEdit ? 'Edit Banner' : 'New Banner'}
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
          ref={formikRef}
          setIsTopPosition={setIsTopPosition}
          isTopPosition={isTopPosition}
          url={url}
          setUrl={setUrl}
          setButtonAction={setButtonAction}
          buttonAction={buttonAction}
          setButtonRepetition={setButtonRepetition}
          buttonRepetition={buttonRepetition}
          actionUrl={actionUrl}
          setActionUrl={setActionUrl}
        />
      )}
      leftAppearance={() => (
        <BannerLeftAppearance
          ref={formikRef}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          fontColor={fontColor}
          setFontColor={setFontColor}
        />
      )}
    />
  );
};

BannerPage.propTypes = {
  autoOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  setIsEdit: PropTypes.func,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setItemsUpdated: PropTypes.func,
};

export default BannerPage;

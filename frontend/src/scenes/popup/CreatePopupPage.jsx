import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import Turndown from 'turndown';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import PopupComponent from '../../products/Popup/PopupComponent';
import {
  addPopup,
  editPopup,
  getPopupById,
} from '../../services/popupServices';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError, onSaveTemplate } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import PopupAppearance from './PopupPageComponents/PopupAppearance/PopupAppearance';
import PopupContent from './PopupPageComponents/PopupContent/PopupContent';
import { popupContentSchema, appearanceSchema } from '../../utils/popupHelper';

const CreatePopupPage = ({
  autoOpen = false,
  isEdit,
  itemId,
  setItemsUpdated,
  setIsEdit,
}) => {
  const { openDialog, closeDialog } = useDialog();
  const [activeButton, setActiveButton] = useState(0);

  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');

  const [popupAppearance, setPopupAppearance] = useState({
    headerBackgroundColor: '#F8F9F8',
    headerColor: '#101828',
    textColor: '#344054',
    buttonBackgroundColor: '#7F56D9',
    buttonTextColor: '#FFFFFF',
    popupSize: 'Small',
  });

  const [popupContent, setPopupContent] = useState({
    repetitionType: 'Show only once',
    closeButtonAction: 'No action',
    url: 'https://',
    actionButtonUrl: 'https://',
    actionButtonText: 'Take me to subscription page',
  });

  const formikRef = useRef(null);

  const markdownContent = new Turndown().turndown(content);

  useEffect(() => {
    if (autoOpen) {
      // auto open dialog to run tests
      openDialog();
    }
  }, [autoOpen, openDialog]);

  const fetchPopupData = async () => {
    try {
      const popupData = await getPopupById(itemId);

      setPopupAppearance({
        headerBackgroundColor: popupData.headerBackgroundColor || '#F8F9F8',
        headerColor: popupData.headerColor || '#101828',
        textColor: popupData.textColor || '#344054',
        buttonBackgroundColor: popupData.buttonBackgroundColor || '#7F56D9',
        buttonTextColor: popupData.buttonTextColor || '#FFFFFF',
        popupSize: popupData.popupSize || 'Small',
      });

      setPopupContent({
        repetitionType: popupData.repetitionType || 'Show only once',
        closeButtonAction: popupData.closeButtonAction || 'No action',
        url: popupData.url || 'https://',
        actionButtonUrl: popupData.actionButtonUrl || 'https://',
        actionButtonText:
          popupData.actionButtonText || 'Take me to subscription page',
      });

      setHeader(popupData.header || '');
      setContent(popupData.content || '');
    } catch (error) {
      console.log({ error });
      emitToastError(error);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPopupData();
    }
  }, [isEdit, itemId]);

  const fields = [
    {
      name: 'headerBackgroundColor',
      label: 'Header Background Color',
    },
    { name: 'headerColor', label: 'Header Color' },
    { name: 'textColor', label: 'Text Color' },
    {
      name: 'buttonBackgroundColor',
      label: 'Button Background Color',
    },
    {
      name: 'buttonTextColor',
      label: 'Button Text Color',
    },
  ];

  const onSave = async () => {
    const popupData = {
      repetitionType: popupContent.repetitionType?.toLowerCase(),
      closeButtonAction: popupContent.closeButtonAction?.toLowerCase(),
      url: popupContent.url,
      actionButtonUrl: popupContent.actionButtonUrl,
      actionButtonText: popupContent.actionButtonText,
      headerBackgroundColor: popupAppearance.headerBackgroundColor,
      headerColor: popupAppearance.headerColor,
      textColor: popupAppearance.textColor,
      buttonBackgroundColor: popupAppearance.buttonBackgroundColor,
      buttonTextColor: popupAppearance.buttonTextColor,
      popupSize: popupAppearance.popupSize?.toLowerCase(),
      header,
      content,
    };

    const appearanceKeys = [
      'headerBackgroundColor',
      'headerColor',
      'textColor',
      'buttonBackgroundColor',
      'buttonTextColor',
      'popupSize',
    ];
    const fieldPriority = [
      'url',
      'actionButtonUrl',
      'actionButtonText',
      'headerBackgroundColor',
      'headerColor',
      'textColor',
      'buttonBackgroundColor',
      'buttonTextColor',
    ];

    await onSaveTemplate({
      data: popupData,
      schema: popupContentSchema.concat(appearanceSchema),
      formikRef,
      appearanceKeys,
      setActiveButton,
      fieldPriority,
      onSuccess: async () => {
        try {
          if (isEdit) {
            await editPopup(itemId, popupData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'You edited this popup');
          } else {
            await addPopup(popupData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'New popup saved');
          }
          setItemsUpdated((prev) => !prev);
          closeDialog();
        } catch (error) {
          console.error('Error saving popup:', error);
          emitToastError(error);
        }
      },
    });
  };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const previewComponent = () => (
    <PopupComponent
      header={header}
      content={markdownContent}
      previewBtnText={popupContent.actionButtonText}
      {...popupAppearance}
    />
  );

  const rightContent = () => (
    <RichTextEditor
      previewComponent={previewComponent}
      header={header}
      setHeader={setHeader}
      setContent={setContent}
      content={content}
      sx={{
        position: 'relative',
        minWidth: '400px',
        maxWidth: '700px',
        marginLeft: '2.5rem',
        marginTop: '1rem',
      }}
    />
  );

  const leftContent = () => (
    <PopupContent
      ref={formikRef}
      setPopupContent={setPopupContent}
      {...popupContent}
      onSave={onSave}
    />
  );

  const leftAppearance = () => (
    <PopupAppearance
      ref={formikRef}
      data={fields}
      popupAppearance={popupAppearance}
      setPopupAppearance={setPopupAppearance}
      onSave={onSave}
    />
  );

  return (
    <GuideTemplate
      title={isEdit ? 'Edit Popup' : 'New Popup'}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
      onSave={onSave}
      rightContent={rightContent}
      leftContent={leftContent}
      leftAppearance={leftAppearance}
      setIsEdit={setIsEdit}
    />
  );
};

CreatePopupPage.propTypes = {
  autoOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setIsEdit: PropTypes.func,
  setItemsUpdated: PropTypes.func,
};

export default CreatePopupPage;

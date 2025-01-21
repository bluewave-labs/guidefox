import HintLeftAppearance from '@components/HintPageComponents/HintLeftAppearance/HintLeftAppearance';
import HintLeftContent from '@components/HintPageComponents/HintLeftContent/HintLeftContent';
import RichTextEditor from '@components/RichTextEditor/RichTextEditor';
import React, { useEffect, useState } from 'react';
import Turndown from 'turndown';
import HintComponent from '../../products/Hint/HintComponent';
import { addHint, editHint, getHintById } from '../../services/hintServices';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';

const HintPage = ({
  autoOpen = false,
  isEdit,
  itemId,
  setItemsUpdated,
  setIsEdit,
}) => {
  const { openDialog, closeDialog } = useDialog();

  const [activeButton, setActiveButton] = useState(0);

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const [appearance, setAppearance] = useState({
    headerBackgroundColor: '#F8F9F8',
    headerColor: '#101828',
    textColor: '#344054',
    buttonBackgroundColor: '#7F56D9',
    buttonTextColor: '#FFFFFF',
  });
  const {
    headerBackgroundColor,
    headerColor,
    textColor,
    buttonBackgroundColor,
    buttonTextColor,
  } = appearance;

  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');
  const markdownContent = new Turndown().turndown(content);

  const [buttonRepetition, setButtonRepetition] = useState('Show only once');

  const [url, setUrl] = useState('https://');
  const [actionButtonUrl, setActionButtonUrl] = useState('https://');
  const [actionButtonText, setActionButtonText] = useState(
    'Take me to subscription page'
  );
  const [action, setAction] = useState('No action');
  const [targetElement, setTargetElement] = useState('.element');
  const [tooltipPlacement, setTooltipPlacement] = useState('Top');

  useEffect(() => {
    if (autoOpen) openDialog();
  }, [autoOpen, openDialog]);

  useEffect(() => {
    if (isEdit) {
      const fetchHintData = async () => {
        try {
          const hintData = await getHintById(itemId);
          setAppearance({
            headerBackgroundColor: hintData.headerBackgroundColor || '#F8F9F8',
            headerColor: hintData.headerColor || '#101828',
            textColor: hintData.textColor || '#344054',
            buttonBackgroundColor: hintData.buttonBackgroundColor || '#7F56D9',
            buttonTextColor: hintData.buttonTextColor || '#FFFFFF',
          });
          setButtonRepetition(bannerData.repetitionType || 'Show only once')
          setHeader(hintData.header || '');
          setContent(hintData.hintContent || '');
          setActionButtonUrl(hintData.actionButtonUrl || 'https://');
          setUrl(hintData.url || 'https://');
          setActionButtonText(hintData.actionButtonText || '');
          setAction(hintData.action || 'No action');
          setTargetElement(hintData.targetElement || '.element');
          setTooltipPlacement(hintData.tooltipPlacement || 'Top');
        } catch (error) {
          emitToastError(error);
        }
      };
      fetchHintData();
    }
  }, [isEdit, itemId]);

  const onSave = async () => {
    const hintData = {
      repetitionType: buttonRepetition.toLowerCase(),
      tooltipPlacement: tooltipPlacement.toLowerCase(),
      url,
      actionButtonUrl,
      actionButtonText,
      action: action.toLowerCase(),
      targetElement,
      header,
      hintContent: content,
      headerBackgroundColor,
      headerColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor,
    };

    try {
      const response = isEdit
        ? await editHint(itemId, hintData)
        : await addHint(hintData);
      const toastMessage = isEdit ? 'You edited this hint' : 'New hint saved';
      toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
      setItemsUpdated((prev) => !prev);
      setHeader('');
      setContent('');
      closeDialog();
    } catch (error) {
      if (error.response.data?.errors) {
        return error.response.data.errors.forEach((err) => {
          toastEmitter.emit(TOAST_EMITTER_KEY, `Error: ${err}`);
        });
      }
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : 'An unexpected error occurred. Please try again.';
      toastEmitter.emit(TOAST_EMITTER_KEY, errorMessage);
    }
  };

  return (
    <GuideTemplate
      title={isEdit ? 'Edit Hint' : 'Create Hint'}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
      onSave={onSave}
      setIsEdit={setIsEdit}
      rightContent={() => (
        <RichTextEditor
          sx={{
            position: 'relative',
            width: '400px',
            maxWidth: '700px',
            marginLeft: '2.5rem',
            marginTop: '1rem',
          }}
          header={header}
          setHeader={setHeader}
          setContent={setContent}
          content={content}
          previewComponent={() => (
            <HintComponent
              header={header}
              content={markdownContent}
              previewBtnText={actionButtonText}
              headerBackgroundColor={headerBackgroundColor}
              headerColor={headerColor}
              textColor={textColor}
              buttonBackgroundColor={buttonBackgroundColor}
              buttonTextColor={buttonTextColor}
            />
          )}
        />
      )}
      leftContent={() => (
        <HintLeftContent
          buttonRepetition={buttonRepetition}
          setButtonRepetition={setButtonRepetition}
          actionButtonText={actionButtonText}
          setActionButtonText={setActionButtonText}
          actionButtonUrl={actionButtonUrl}
          setActionButtonUrl={setActionButtonUrl}
          setUrl={setUrl}
          url={url}
          action={action}
          setAction={setAction}
          targetElement={targetElement}
          setTargetElement={setTargetElement}
          tooltipPlacement={tooltipPlacement}
          setTooltipPlacement={setTooltipPlacement}
          onSave={onSave}
        />
      )}
      leftAppearance={() => (
        <HintLeftAppearance
          data={appearance}
          setState={setAppearance}
          onSave={onSave}
        />
      )}
    />
  );
};

export default HintPage;

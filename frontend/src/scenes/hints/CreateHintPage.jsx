import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Turndown from 'turndown';
import HintLeftAppearance from '@components/HintPageComponents/HintLeftAppearance/HintLeftAppearance';
import HintLeftContent from '@components/HintPageComponents/HintLeftContent/HintLeftContent';
import RichTextEditor from '@components/RichTextEditor/RichTextEditor';
import HintComponent from '../../products/Hint/HintComponent';
import { addHint, editHint, getHintById } from '../../services/hintServices';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError, onSaveTemplate } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import { newHintSchema, appearanceSchema } from '../../utils/hintHelper';

const HintPage = ({
  autoOpen = false,
  isEdit,
  itemId,
  setItemsUpdated,
  setIsEdit,
}) => {
  const [activeButton, setActiveButton] = useState(0);
  const formikRef = useRef(null);
  const { openDialog, closeDialog } = useDialog();

  const params = new URLSearchParams(window.location.search);

  const hintTargetParam = params.get('hintTarget');
  const hintTarget = hintTargetParam ? JSON.parse(hintTargetParam) : null;

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

  const [leftContent, setLeftContent] = useState({
    buttonRepetition: 'show only once',
    url: 'https://',
    actionButtonUrl: 'https://',
    actionButtonText: 'Take me to subscription page',
    action: 'No action',
    targetElement: '.element',
    tooltipPlacement: 'Top',
    isHintIconVisible: true,
  });

  const {
    buttonRepetition,
    url,
    actionButtonUrl,
    actionButtonText,
    action,
    targetElement,
    tooltipPlacement,
    isHintIconVisible,
  } = leftContent;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

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
          setLeftContent({
            buttonRepetition: hintData.repetitionType || 'show only once',
            url: hintData.url || 'https://',
            actionButtonUrl: hintData.actionButtonUrl || 'https://',
            actionButtonText:
              hintData.actionButtonText || 'Take me to subscription page',
            action: capitalizeFirstLetter(hintData.action) || 'No action',
            targetElement: hintData.targetElement || '.element',
            tooltipPlacement:
              capitalizeFirstLetter(hintData.tooltipPlacement) || 'Top',
            isHintIconVisible: hintData.isHintIconVisible ?? true,
          });
          setHeader(hintData.header || '');
          setContent(hintData.hintContent || '');
        } catch (error) {
          emitToastError(error);
        }
      };
      fetchHintData();
    }
  }, [isEdit, itemId]);

  const preFillHintTarget = useCallback(() => {
    try {
      setLeftContent((prev) => ({ ...prev, targetElement: hintTarget }));

      openDialog();
    } catch (error) {
      console.error('Error parsing hint data:', error);
      toastEmitter.emit(TOAST_EMITTER_KEY, 'Invalid hint data format');
    }
  }, [hintTarget, openDialog]);

  useEffect(() => {
    if (!autoOpen) return;

    if (hintTarget) {
      preFillHintTarget();
    } else {
      openDialog();
    }
  }, [autoOpen, hintTarget, preFillHintTarget, openDialog]);

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
      isHintIconVisible,
    };

    // used in onSaveTemplate() input validation/error to switch to appearance tab
    const appearanceKeys = [
      'headerBackgroundColor',
      'headerColor',
      'textColor',
      'buttonBackgroundColor',
      'buttonTextColor',
    ];

    // defines the order of validation/error prioritization
    const fieldPriority = [
      'url',
      'actionButtonUrl',
      'actionButtonText',
      'targetElement',
      'headerBackgroundColor',
      'headerColor',
      'textColor',
      'buttonBackgroundColor',
      'buttonTextColor',
    ];
    await onSaveTemplate({
      data: hintData,
      schema: newHintSchema.concat(appearanceSchema),
      formikRef,
      appearanceKeys,
      setActiveButton,
      fieldPriority,
      onSuccess: async () => {
        try {
          if (isEdit) {
            await editHint(itemId, hintData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'You edited this hint');
          } else {
            await addHint(hintData);
            toastEmitter.emit(TOAST_EMITTER_KEY, 'New hint saved');
          }
          setItemsUpdated((prev) => !prev);
          closeDialog();
        } catch (error) {
          console.error('Error saving hint:', error);
          emitToastError(error);
        }
        setIsEdit(false);
      },
    });
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
          data={leftContent}
          setState={setLeftContent}
          onSave={onSave}
          ref={formikRef}
        />
      )}
      leftAppearance={() => (
        <HintLeftAppearance
          data={appearance}
          setState={setAppearance}
          onSave={onSave}
          ref={formikRef}
        />
      )}
    />
  );
};

HintPage.propTypes = {
  autoOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  setIsEdit: PropTypes.func,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setItemsUpdated: PropTypes.func,
};

export default HintPage;

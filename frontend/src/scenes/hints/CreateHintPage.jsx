import React, { useEffect, useState } from "react";
import Turndown from "turndown";
import GuideTemplate from "../../templates/GuideTemplate/GuideTemplate";
import RichTextEditor from "@components/RichTextEditor/RichTextEditor";
import HintComponent from "../../products/Hint/HintComponent";
import HintLeftContent from "@components/HintPageComponents/HintLeftContent/HintLeftContent";
import HintLeftAppearance from "@components/HintPageComponents/HintLeftAppearance/HintLeftAppearance";
import { addHint, getHintById, editHint } from '../../services/hintServices';
import toastEmitter, { TOAST_EMITTER_KEY } from "../../utils/toastEmitter";
import { emitToastError } from "../../utils/guideHelper";
import { useDialog } from "../../templates/GuideTemplate/GuideTemplateContext";

const HintPage = ({ autoOpen = false, isEdit, itemId, setItemsUpdated }) => {
  const { openDialog, closeDialog } = useDialog();

  const [activeButton, setActiveButton] = useState(0);

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#FFFFFF");
  const [headerColor, setHeaderColor] = useState("#101828");
  const [textColor, setTextColor] = useState("#344054");
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState("#7F56D9");
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF");

  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const markdownContent = new Turndown().turndown(content);
  
  const [actionButtonUrl, setActionButtonUrl] = useState("https://");
  const [actionButtonText, setActionButtonText] = useState("Take me to subscription page");
  const [action, setAction] = useState("No action");
  const [targetElement, setTargetElement] = useState(".element");
  const [tooltipPlacement, setTooltipPlacement] = useState("Top");

  const stateList = [
    {
      stateName: "Header Background Color",
      state: headerBackgroundColor,
      setState: setHeaderBackgroundColor,
    },
    {
      stateName: "Header Color",
      state: headerColor,
      setState: setHeaderColor,
    },
    { stateName: "Text Color", state: textColor, setState: setTextColor },
    {
      stateName: "Button Background Color",
      state: buttonBackgroundColor,
      setState: setButtonBackgroundColor,
    },
    {
      stateName: "Button Text Color",
      state: buttonTextColor,
      setState: setButtonTextColor,
    },
  ];

  useEffect(() => {
    if (autoOpen) openDialog();
  }, [autoOpen, openDialog]);

  useEffect(() => {
    if (isEdit) {
      const fetchHintData = async () => {
        try {
          const hintData = await getHintById(itemId);
          setHeaderBackgroundColor(hintData.headerBackgroundColor || "#F8F9F8");
          setHeaderColor(hintData.headerColor || "#101828");
          setTextColor(hintData.textColor || "#344054");
          setButtonBackgroundColor(hintData.buttonBackgroundColor || "#7F56D9");
          setButtonTextColor(hintData.buttonTextColor || "#FFFFFF");
          setHeader(hintData.header || "");
          setContent(hintData.hintContent || "");
          setActionButtonUrl(hintData.actionButtonUrl || "https://");
          setActionButtonText(hintData.actionButtonText || "");
          setAction(hintData.action || "No action");
        } catch (error) {
          emitToastError(error);
        }
      };
      fetchHintData();
    }
  }, [isEdit, itemId]);

  const onSave = async () => {
    const hintData = {
      tooltipPlacement: tooltipPlacement.toLowerCase(),
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
      const toastMessage = isEdit ? "You edited this hint" : "New hint saved";
      toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
      setItemsUpdated((prev) => !prev);
      setHeader("");
      setContent("");
      closeDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : "An unexpected error occurred. Please try again.";
      toastEmitter.emit(TOAST_EMITTER_KEY, errorMessage);
    }
  };

  return (
    <GuideTemplate
      title={isEdit ? "Edit Hint" : "Create Hint"}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
      onSave={onSave}
      rightContent={() => (
        <RichTextEditor
          sx={{
            width: "400px",
            maxWidth: "700px",
            marginLeft: "2.5rem",
            marginTop: "1rem",
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
          actionButtonText={actionButtonText}
          setActionButtonText={setActionButtonText}
          actionButtonUrl={actionButtonUrl}
          setActionButtonUrl={setActionButtonUrl}
          action={action}
          setAction={setAction}
          targetElement={targetElement}
          setTargetElement={setTargetElement}
          tooltipPlacement={tooltipPlacement}
          setTooltipPlacement={setTooltipPlacement}
        />
      )}
      leftAppearance={() => <HintLeftAppearance data={stateList} />}
    />
  );
};

export default HintPage;

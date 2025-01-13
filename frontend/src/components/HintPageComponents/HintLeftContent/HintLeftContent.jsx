import React from "react";
import DropdownList from "../../DropdownList/DropdownList";
import CustomTextField from "../../TextFieldComponents/CustomTextField/CustomTextField";
import "./HintLeftContent.css";

const HintLeftContent = ({ actionButtonText, setActionButtonText, actionButtonUrl, setActionButtonUrl, action, setAction, targetElement, setTargetElement, tooltipPlacement, setTooltipPlacement, setUrl, url }) => {
  const handleActionButtonText = (event) => {
    setActionButtonText(event.target.value);
  };
  const handleActionButtonUrl = (event) => {
    setActionButtonUrl(event.target.value);
  };
  const handleUrl = (event) => {
    setUrl(event.target.value);
  };
  const handleActionChange = (newAction) => {
    setAction(newAction);
  };

  const handleTargetElement = (event) => {
    setTargetElement(event.target.value);
  };

  const handleTooltipPlacement = (newAction) => {
    setTooltipPlacement(newAction);
  }

  return (
    <div className="left-content-container">
      <h2 className="hint-label" style={{ marginBottom: 0, marginTop: "16px" }}>
        Url (can be relative)
      </h2>
      <CustomTextField
        TextFieldWidth="241px"
        value={url}
        onChange={handleUrl}
      />
      <h2 className="hint-label" style={{ marginTop: "16px" }}>
        Action
      </h2>
      <DropdownList
        actions={["No action", "Open URL", "Open URL in a new tab"]}
        onActionChange={handleActionChange}
        selectedActionString={action.toLowerCase()}
      />
      <h2 className="hint-label" style={{ marginBottom: 0, marginTop: "16px" }}>
        Action button url (can be relative)
      </h2>
      <CustomTextField
        TextFieldWidth="241px"
        value={actionButtonUrl}
        onChange={handleActionButtonUrl}
      />
      <h2 className="hint-label" style={{ marginBottom: 0 }}>
        Action button text
      </h2>
      <CustomTextField
        TextFieldWidth="241px"
        value={actionButtonText}
        onChange={handleActionButtonText}
      />
      <h2 className="hint-label" style={{ marginBottom: 0 }}>
        Target Element
      </h2>
      <CustomTextField
        TextFieldWidth="241px"
        value={targetElement}
        onChange={handleTargetElement}
        helperText="Page element to attach tooltip to"
      />
      <h2 className="hint-label">Tooltip Placement</h2>
      <DropdownList
        actions={["Top", "Right", "Bottom", "Left"]}
        onActionChange={handleTooltipPlacement}
        selectedActionString={tooltipPlacement}
      />
    </div>
  );
};

export default HintLeftContent;

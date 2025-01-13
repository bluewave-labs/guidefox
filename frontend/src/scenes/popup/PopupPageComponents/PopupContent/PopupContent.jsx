import DropdownList from "@components/DropdownList/DropdownList";
import CustomTextField from "@components/TextFieldComponents/CustomTextField/CustomTextField";
import PropTypes from "prop-types";
import { React } from "react";
import styles from "./PopupContent.module.scss";

const PopupContent = ({
  actionButtonText,
  setActionButtonText,
  setActionButtonUrl,
  buttonAction,
  actionButtonUrl,
  setButtonAction,
  buttonRepetition,
  setButtonRepetition,
  url,
  setUrl,
}) => {
  const handleActionButtonText = (event) => {
    setActionButtonText(event.target.value);
  };

  const handleActionButtonUrl = (event) => {
    setActionButtonUrl(event.target.value);
  };

  const handleActionChange = (newAction) => {
    setButtonAction(newAction);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleRepetitionChange = (newRepetitionType) => {
    setButtonRepetition(newRepetitionType);
  };

  return (
    <div className={styles.container}>
      <h2 style={{marginTop: '1.5rem'}}>Repetition</h2>
      <DropdownList
        actions={['Show only once', 'Show every visit']}
        onActionChange={handleRepetitionChange}
        selectedActionString={buttonRepetition}
      />
      <h2>Action</h2>
      <DropdownList
        actions={["No action", "Open URL", "Open URL in a new tab"]}
        onActionChange={handleActionChange}
        selectedActionString={buttonAction}
      />
      <h2 style={{ marginBottom: 0 }}>URL</h2>
      <CustomTextField
        TextFieldWidth='241px'
        value={url}
        onChange={handleUrlChange}
      />
      <h2 style={{ marginBottom: 0 }}>Action button URL (can be relative)</h2>
      <CustomTextField
        TextFieldWidth='241px'
        value={actionButtonUrl}
        onChange={handleActionButtonUrl}
      />
      <h2 style={{ marginBottom: 0 }}>Action button text</h2>
      <CustomTextField
        TextFieldWidth='241px'
        value={actionButtonText}
        onChange={handleActionButtonText}
      />
    </div>
  );
};

export default PopupContent;
PopupContent.propTypes = {
  actionButtonText: PropTypes.string,
  setActionButtonText: PropTypes.func,
  setActionButtonUrl: PropTypes.func,
  buttonAction: PropTypes.string,
  actionButtonUrl: PropTypes.string,
  setButtonAction: PropTypes.func,
  url: PropTypes.string,
  setUrl: PropTypes.func,
  buttonRepetition: PropTypes.string,
  setButtonRepetition: PropTypes.func,
};

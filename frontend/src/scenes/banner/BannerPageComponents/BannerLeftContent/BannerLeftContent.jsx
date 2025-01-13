import DropdownList from "@components/DropdownList/DropdownList";
import RadioButton from "@components/RadioButton/RadioButton";
import CustomTextField from "@components/TextFieldComponents/CustomTextField/CustomTextField";
import PropTypes from "prop-types";
import React from "react";
import styles from "./BannerLeftContent.module.scss";

const BannerLeftContent = ({
  setIsTopPosition,
  url,
  setUrl,
  setButtonAction,
  isTopPosition,
  buttonAction,
  buttonRepetition,
  setButtonRepetition,
  actionUrl,
  setActionUrl,
}) => {
  const handleSetUrl = (event) => {
    setUrl(event.target.value);
  };

  const handleSetActionUrl = (event) => {
    setActionUrl(event.target.value);
  };

  const handleActionChange = (newAction) => {
    setButtonAction(newAction);
  };

  const handlePositionChange = (newPosition) => {
    setIsTopPosition(newPosition);
  };

  const handleRepetitionChange = (newRepetitionType) => {
    setButtonRepetition(newRepetitionType);
  };

  return (
    <div className={styles.container}>
      <h2 style={{marginTop: '1.5rem', marginBottom: '5.3px'}}>Repetition</h2>
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
      <h2 style={{ marginBottom: '10px'}}>Position</h2>
      <div className={styles.radioContent}>
        <RadioButton
          label='Top (centered)'
          checked={isTopPosition}
          onChange={() => handlePositionChange(true)}
        />
      </div>
      <div className={styles.radioContent}>
        <RadioButton
          label='Bottom (centered)'
          checked={!isTopPosition}
          onChange={() => handlePositionChange(false)}
        />
      </div>

      <h2>URL</h2>
      <CustomTextField
        TextFieldWidth='241px'
        value={url}
        onChange={handleSetUrl}
      />

      <h2>Action URL</h2>
      <CustomTextField
        TextFieldWidth='241px'
        value={actionUrl}
        onChange={handleSetActionUrl}
      />
    </div>
  );
};

export default BannerLeftContent;
BannerLeftContent.propTypes = {
  setIsTopPosition: PropTypes.func,
  url: PropTypes.string,
  setUrl: PropTypes.func,
  setButtonAction: PropTypes.func,
  isTopPosition: PropTypes.bool,
  buttonAction: PropTypes.string,
  actionUrl: PropTypes.string,
  setActionUrl: PropTypes.func,
  setButtonRepetition: PropTypes.func,
  buttonRepetition: PropTypes.string
};

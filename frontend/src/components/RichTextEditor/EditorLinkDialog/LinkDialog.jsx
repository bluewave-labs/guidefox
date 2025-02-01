import React from 'react';
import PropTypes from 'prop-types';
import CustomTextField from '../../TextFieldComponents/CustomTextField/CustomTextField';
import PopUpMessages from '../../PopUpMessages/PopUpMessages';

const LinkDialog = ({
  open,
  url = '',
  isLinkActive = false,
  setUrl = () => {},
  handleClose = () => {},
  handleInsertLink = () => {},
  handleOpenLink = () => {},
}) => {
  const title = isLinkActive ? 'Edit link' : 'Add link';
  return (
    <PopUpMessages
      open={open}
      header={title}
      leftButtonClickHandler={handleClose}
      rightButtonClickHandler={handleInsertLink}
      leftButtonText={'Cancel'}
      additionanLinkButton={isLinkActive}
      handleOpenLink={handleOpenLink}
      rightButtonText={`${url ? 'Insert/Update' : 'Remove link'}`}
    >
      <CustomTextField
        type="url"
        placeholder="https://"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </PopUpMessages>
  );
};

LinkDialog.propTypes = {
  url: PropTypes.string,
  isLinkActive: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  setUrl: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleInsertLink: PropTypes.func.isRequired,
  handleOpenLink: PropTypes.func.isRequired,
};

export default LinkDialog;

import PropTypes from "prop-types";
import { DialogContentText } from "@mui/material";
import PopUpMessages from "../../../../components/PopUpMessages/PopUpMessages.jsx";

const ConfirmationPopup = ({ open, onConfirm, onCancel }) => {
  return (
    <PopUpMessages
      open={open}
      header="Confirm Action"
      leftButtonClickHandler={onCancel}
      rightButtonClickHandler={onConfirm}
      leftButtonText="Cancel"
      rightButtonText="Confirm"
    >
      <DialogContentText sx={{ fontSize: "13px" }}>
        Are you sure you want to perform this action?
      </DialogContentText>
    </PopUpMessages>
  );
};

ConfirmationPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationPopup;

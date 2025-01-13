import PopUpMessages from "../../../../components/PopUpMessages/PopUpMessages";
import { DialogContentText } from "@mui/material";

const DeleteConfirmationModal = ({ open, handleClose, handleDelete }) => {
  return (
    <PopUpMessages
      open={open}
      header="Confirm Action"
      leftButtonClickHandler={handleClose}
      rightButtonClickHandler={handleDelete}
      leftButtonText="Cancel"
      rightButtonText="Delete Account"
      leftButtonType="secondary-grey"
      rightButtonType="error"
    >
      <DialogContentText sx={{ fontSize: "13px", paddingTop: 1 }}>
        If you delete your account, you will no longer be able to sign in, and
        all of your data will be deleted. Deleting your account is permanent and
        non-recoverable action.
      </DialogContentText>
    </PopUpMessages>
  );
};

export default DeleteConfirmationModal;
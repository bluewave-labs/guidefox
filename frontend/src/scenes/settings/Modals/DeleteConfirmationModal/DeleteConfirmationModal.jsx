import PropTypes from 'prop-types';
import { DialogContentText } from '@mui/material';
import PopUpMessages from '../../../../components/PopUpMessages/PopUpMessages';

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
      <DialogContentText sx={{ fontSize: '13px', paddingTop: 1 }}>
        If you delete your account, you will no longer be able to sign in, and
        all of your data will be deleted. Deleting your account is permanent and
        non-recoverable action.
      </DialogContentText>
    </PopUpMessages>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default DeleteConfirmationModal;

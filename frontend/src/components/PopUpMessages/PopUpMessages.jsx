import PropTypes from 'prop-types';
import { popupStyles } from './PopUpStyles';
import Button from '../Button/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const PopUpMessages = ({
  open,
  header,
  leftButtonText,
  rightButtonText,
  leftButtonClickHandler,
  rightButtonClickHandler,
  leftButtonType,
  rightButtonType,
  handleOpenLink,
  additionanLinkButton,
  children,
}) => {
  return (
    <Dialog
      PaperProps={{ sx: popupStyles.paper }}
      open={open}
      onClose={leftButtonClickHandler}
      closeAfterTransition={open}
    >
      <DialogTitle sx={popupStyles.title}>{header}</DialogTitle>

      <DialogContent sx={popupStyles.content}>{children}</DialogContent>

      <DialogActions sx={popupStyles.actions}>
        {additionanLinkButton && (
          <Button
            text="Open link"
            buttonType="secondary"
            variant="text"
            onClick={handleOpenLink}
          />
        )}
        <Button
          text={leftButtonText}
          buttonType={leftButtonType || 'secondary'}
          variant="text"
          onClick={leftButtonClickHandler}
          sx={popupStyles.contentText}
        />
        <Button
          text={rightButtonText}
          onClick={rightButtonClickHandler}
          variant="contained"
          buttonType={rightButtonType || 'secondary'}
          sx={popupStyles.contentText}
        />
      </DialogActions>
    </Dialog>
  );
};

PopUpMessages.propTypes = {
  open: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  leftButtonText: PropTypes.string.isRequired,
  rightButtonText: PropTypes.string.isRequired,
  leftButtonClickHandler: PropTypes.func.isRequired,
  rightButtonClickHandler: PropTypes.func.isRequired,
  leftButtonType: PropTypes.string,
  rightButtonType: PropTypes.string,
  handleOpenLink: PropTypes.func,
  additionanLinkButton: PropTypes.bool,
};

export default PopUpMessages;

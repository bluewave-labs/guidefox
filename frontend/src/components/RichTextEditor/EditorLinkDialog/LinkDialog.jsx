import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "../../Button/Button";
import CustomTextField from "../../TextFieldComponents/CustomTextField/CustomTextField";
import { dialogStyles } from "./DialogStyles";

const LinkDialog = ({
  open,
  handleClose = () => {},
  url = "",
  setUrl = () => {},
  isLinkActive = false,
  handleInsertLink = () => {},
  handleOpenLink = () => {},
}) => {
  return (
    <Dialog
      PaperProps={{
        sx: dialogStyles.paper,
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle sx={dialogStyles.title}>
        {isLinkActive ? "Edit link" : "Add link"}
      </DialogTitle>
      <DialogContent sx={dialogStyles.content}>
        <CustomTextField
          type="url"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={dialogStyles.actions}>
        {isLinkActive && (
          <Button
            text="Open Link"
            buttonType="secondary"
            variant="text"
            onClick={handleOpenLink}
          />
        )}

        <Button
          text="Cancel"
          buttonType="secondary"
          variant="text"
          onClick={handleClose}
        />
        <Button
          text={url ? "Insert/Update" : "Remove link"}
          onClick={handleInsertLink}
        />
      </DialogActions>
    </Dialog>
  );
};

export default LinkDialog;

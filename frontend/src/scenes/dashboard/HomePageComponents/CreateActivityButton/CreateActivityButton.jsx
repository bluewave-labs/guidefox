import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { activityButtonStyles } from "./ActivityButtonStyles";

const CreateActivityButton = ({
  placeholder = "",
  skeletonType,
  onClick = () => {},
}) => {
  return (
    <Button variant="text" onClick={onClick} sx={activityButtonStyles}>
      {skeletonType}
      {placeholder}
    </Button>
  );
};

CreateActivityButton.propTypes = {
  skeletonType: PropTypes.node,
  placeholder: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default CreateActivityButton;

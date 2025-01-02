import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./PopUpMessages.module.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const PopUpMessages = ({
  // Defined default values for props
  header = "",
  content = "",
  leftBtnText = "Dismiss",
  rightBtnText = "View Changes",
  type = 1,
  isOpen = false,
  hidePopUp,
}) => {
  const getIcon = () => {
    switch (type) {
      case 1:
        return <InfoOutlinedIcon className={styles.icon} />;
      case 2:
        return (
          <ErrorOutlineOutlinedIcon
            className={styles.icon}
            style={{ color: "#D92D20" }}
          />
        );
      case 3:
        return (
          <ErrorOutlineOutlinedIcon
            className={styles.icon}
            style={{ color: "#079455" }}
          />
        );
      default:
        return null;
    }
  };
  const containerStyle = {
    maxWidth: type === 4 || type === 5 ? "20rem" : "30rem",
  };

  const messageStyle = {
    margin: type === 5 ? "0" : "0.5rem 0px",
  };

  //Close PopUp when we click outside of the component
  const ref = useRef();
  useEffect(() => {
    if (!isOpen) return;

    //Add callback separately so we can cleanup later
    const callback = (e) => {
      if (ref.current?.contains?.(e.target)) return;
      hidePopUp();
    };
    document.addEventListener("click", callback, true);

    //CLEAN UP to prevent memory leaks
    return () => {
      document.removeEventListener("click", callback, true);
    };
  }, [isOpen, hidePopUp]);

  if (!isOpen) return null;

  return (
    <div className={styles.container} style={containerStyle} ref={ref}>
      <div className={styles.iconAndText}>
        {getIcon()}
        <div className={styles.textContainer}>
          {type !== 5 && <h2>{header}</h2>}
          <h3 style={messageStyle}>{content}</h3>
          {type !== 5 && (
            <div className={styles.buttons}>
              <button className={styles.dismiss}>{leftBtnText}</button>
              <button className={styles.acceptButton}>{rightBtnText}</button>
            </div>
          )}
        </div>
      </div>

      <button
        className={styles.closeBtn}
        onClick={hidePopUp}
        aria-label="Close"
      >
        <CloseOutlinedIcon style={{ color: "#98A2B3" }} />
      </button>
    </div>
  );
};

PopUpMessages.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string.isRequired,
  leftBtnText: PropTypes.string,
  rightBtnText: PropTypes.string,
  type: PropTypes.oneOf([1, 2, 3, 4, 5]),
  isOpen: PropTypes.bool,
  hidePopUp: PropTypes.func.isRequired,
};

export default PopUpMessages;

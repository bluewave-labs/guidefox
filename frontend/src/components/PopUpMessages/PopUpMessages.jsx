import styles from "./PopUpMessages.module.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const PopUpMessages = ({
  // Defined default values for props
  header = "We’ve just released a new feature",
  content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.",
  leftBtnText = "Dismiss",
  rightBtnText = "View Changes",
  type = 1,
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

  return (
    <div className={styles.container} style={containerStyle}>
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

      <button className={styles.closeBtn}>
        <CloseOutlinedIcon style={{ color: "#98A2B3" }} />
      </button>
    </div>
  );
};

export default PopUpMessages;

import React from "react";
import ReactMarkdown from "react-markdown";
import "./HintComponent.css";
import Button from "../../components/Button/Button";
import PropTypes from 'prop-types';

const HintComponent = ({
  header,
  content,
  previewBtnText,
  headerBackgroundColor,
  headerColor,
  textColor,
  buttonBackgroundColor,
  buttonTextColor,
}) => {
  return (
    <>
      <div className="preview-container">
        {header && (
          <div
            className={"header"}
            style={{
              backgroundColor: headerBackgroundColor,
              color: headerColor,
            }}
          >
            <h3>{header}</h3>
          </div>
        )}
        <div className="preview-content-container" style={{ color: textColor }}>
          <div className="preview-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <div className="preview-button-container">
            {previewBtnText && (
              <Button
                style={{
                  backgroundColor: buttonBackgroundColor,
                  color: buttonTextColor,
                  marginBottom: "1rem",
                  borderRadius: '8px'
                }}
                text={previewBtnText}
              ></Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

HintComponent.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string.isRequired,
  previewBtnText: PropTypes.string,
  headerBackgroundColor: PropTypes.string,
  headerColor: PropTypes.string,
  textColor: PropTypes.string,
  buttonBackgroundColor: PropTypes.string,
  buttonTextColor: PropTypes.string
};
export default HintComponent;

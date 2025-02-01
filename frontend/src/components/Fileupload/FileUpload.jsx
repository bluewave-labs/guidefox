import React, { useState } from 'react';
import styles from './FileUpload.module.scss';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import classNames from 'classnames';
import { formatFileSize, getFileExtension } from '../../utils/generalHelper';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFileActive, setIsFileActive] = useState(false);
  const [isUploadFailed, setIsUploadFailed] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsFileActive(true);
    setUploadPercentage(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setIsFileActive(true);
      setUploadPercentage(0);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setUploadPercentage(0);
    setIsFileActive(false);
  };

  const handleCheck = () => {
    setIsFileActive(!isFileActive);
  };

  return (
    <div
      className={classNames(styles.container, {
        [styles.redBorder]: isUploadFailed,
      })}
    >
      {selectedFile && (
        <div className={styles.fileDetails}>
          <span className={styles.fileType}>
            {getFileExtension(selectedFile)}
          </span>
          <FileOpenOutlinedIcon
            className={styles.fileIcon}
            style={isUploadFailed ? { color: 'var(--border-error-solid)' } : {}}
          />
        </div>
      )}
      <div
        className={`${styles.fileUpload} ${isDragging ? styles.dragging : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!selectedFile && (
          <div className={styles.dragDrop}>
            <input
              type="file"
              id="file"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="file">Upload File </label>
          </div>
        )}
        <span className={styles.progressText}>
          {selectedFile && selectedFile.name}
        </span>
        <div className={styles.informativeText}>
          {selectedFile && !isUploadFailed && formatFileSize(selectedFile.size)}
        </div>
        {isUploadFailed && (
          <span className={styles.informativeText}>
            {' '}
            Upload failed, please try again{' '}
          </span>
        )}
        {selectedFile && !isUploadFailed && (
          <div className={styles.progressBarContainer}>
            <progress
              id="progressBar"
              value={uploadPercentage}
              max="100"
              className={styles.progressBar}
            ></progress>
          </div>
        )}
      </div>
      {selectedFile && (
        <div className={styles.thirdBlock}>
          {uploadPercentage === 100 ? (
            <button onClick={handleCheck}>
              <CheckBoxIcon
                style={
                  isFileActive
                    ? { color: 'var(--main-purple)' }
                    : { color: 'var(--third-text-color)' }
                }
              />
            </button>
          ) : (
            <button onClick={handleDelete}>
              <DeleteOutlinedIcon
                style={
                  isUploadFailed
                    ? { color: 'var(--border-error-solid)' }
                    : { color: 'var(--third-text-color)' }
                }
              />
            </button>
          )}
          {!isUploadFailed && (
            <span className={styles.progressText}>{uploadPercentage}%</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

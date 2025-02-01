import { React, useState, useCallback } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@components/Button/Button';
import styles from './UploadModal.module.scss';
import { useDropzone } from 'react-dropzone';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PropTypes from 'prop-types';

const VALID_EXTENSIONS = ['jpg', 'png'];

const UploadModal = ({
  open,
  handleClose,
  handleUpload,
  uploadedFile,
  setUploadedFile,
}) => {
  const [uploadFileErrors, setUploadFileErrors] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setUploadFileErrors();
    setUploadedFile(acceptedFiles[0]); // Only allow one file

    // check for explicit extension as image/jpeg also includes .jfif and other formats
    const fileExtension = acceptedFiles[0].name.split('.').pop().toLowerCase();

    if (VALID_EXTENSIONS.includes(fileExtension)) {
      setUploadedFile(acceptedFiles[0]);
    } else {
      setUploadedFile();
      setUploadFileErrors(`File should be ${VALID_EXTENSIONS.join(' or ')}`);
    }
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
  });

  const clearUploadedFile = () => {
    setUploadedFile(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-avatar-modal"
    >
      <Box className={styles.uploadBox}>
        <p>Upload Image</p>
        <div className={styles.uploadContainer} {...getRootProps()}>
          <input {...getInputProps()} />
          {!uploadedFile && (
            <>
              <CloudUploadOutlinedIcon
                style={{
                  border: '1px solid #ddd',
                  padding: '0.5rem',
                  borderRadius: '5px',
                }}
              />
              <p>
                <span>Click to upload</span> or drag and drop <br></br>(maximum
                size: 3MB)
              </p>
            </>
          )}
          {uploadedFile && <p>{uploadedFile.path}</p>}
        </div>
        {uploadFileErrors && (
          <p className={styles.errorMessage}>{uploadFileErrors}</p>
        )}
        {fileRejections.map(({ file, errors }, index) => (
          <div key={`${file.name}-${index}`}>
            {errors.map((e) => (
              <p className={styles.errorMessage} key={e.code}>
                {e.message}
              </p>
            ))}
          </div>
        ))}
        <p>Supported formats: JPG, PNG</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            buttonType="secondary-grey"
            text="Close"
            onClick={handleClose}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              disabled={!uploadedFile}
              onClick={clearUploadedFile}
              buttonType="secondary-grey"
              text="Clear"
            />
            <Button
              disabled={!uploadedFile}
              onClick={handleUpload}
              text="Update"
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};
UploadModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleUpload: PropTypes.func,
  uploadedFile: PropTypes.instanceOf(File),
  setUploadedFile: PropTypes.func,
};

export default UploadModal;

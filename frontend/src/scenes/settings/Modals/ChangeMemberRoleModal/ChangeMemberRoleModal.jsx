import { React } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@components/Button/Button';
import styles from './ChangeMemberRoleModal.module.scss';

const ChangeMemberRoleModal = ({
  open,
  setModalOpen,
  selectedMember,
  handleChangeRole,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setModalOpen(false)}
      aria-labelledby="change-role-avatar-modal"
      aria-describedby="change-role-description"
    >
      <Box className={styles.box}>
        <h3 id="delete-modal-title">Confirm role change</h3>
        <p id="delete-modal-description">
          Role of {selectedMember?.name} would be changed from{' '}
          {selectedMember?.role} to {selectedMember?.newRole}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              buttonType="secondary-grey"
              text="Cancel"
              onClick={() => setModalOpen(false)}
            />
            <Button
              buttonType="primary"
              text="Confirm"
              onClick={handleChangeRole}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

ChangeMemberRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  selectedMember: PropTypes.object,
  handleChangeRole: PropTypes.func.isRequired,
};

export default ChangeMemberRoleModal;

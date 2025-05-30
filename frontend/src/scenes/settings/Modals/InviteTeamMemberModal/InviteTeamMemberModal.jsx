import { React, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@components/Button/Button';
import styles from './InviteTeamMemberModal.module.scss';
import CustomTextField from '@components/TextFieldComponents/CustomTextField/CustomTextField';
import DropdownList from '@components/DropdownList/DropdownList';
import { roles } from '../../../../utils/constants';

const InviteTeamMemberModal = ({
  open,
  handleClose,
  handleInviteTeamMember,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(roles?.[0] || '');

  const handleActionChange = (role) => {
    setRole(role);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleInviteTeamMember({
      email: formData.get('email'),
      role: formData.get('role'),
    });
    setEmail('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="invite-member-avatar-modal"
      aria-describedby="invite-member-description"
    >
      <Box className={styles.box}>
        <form onSubmit={onSubmit}>
          <p>Invite New Team Member</p>
          <p id="invite-member-description">
            When you add a new team member, they will get access to all
            monitors.
          </p>
          <CustomTextField
            TextFieldWidth="100%"
            style={{ marginBottom: '0.75rem' }}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            type="email"
            id="invite-member-email"
            required
          />
          <DropdownList
            name="role"
            actions={roles}
            onActionChange={handleActionChange}
            selectedActionString={role}
            className={styles.select}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                buttonType="secondary-grey"
                text="Cancel"
                onClick={handleClose}
              />
              <Button type="submit" buttonType="primary" text="Send Invite" />
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

InviteTeamMemberModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleInviteTeamMember: PropTypes.func.isRequired,
};

export default InviteTeamMemberModal;

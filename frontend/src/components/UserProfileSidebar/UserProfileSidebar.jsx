import React from 'react';
import { useAuth } from '../../services/authProvider';
import Avatar from '../Avatar/Avatar';
import DropdownMenu from '../DropdownMenu/DropdownMenu'; // Adjusted import
import styles from './UserProfileSidebar.module.css';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/loginServices';
import { handleGenericError } from '../../utils/settingsHelper';
import { getFullName } from '../../utils/generalHelper';

function UserProfileSidebar() {
  const { userInfo, logoutAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
      logoutAuth();
      navigate('/');
    } catch (error) {
      handleGenericError('Error logging out');
    }
  };

  const fullName = getFullName(userInfo);

  const menuItems = [
    {
      text: 'Settings',
      icon: <SettingsOutlinedIcon />,
      onClick: () => navigate('/settings'),
    },
    {
      text: 'Logout',
      icon: <LogoutOutlinedIcon />,
      onClick: handleLogoutClick,
    },
  ];

  return (
    <div className={styles['user-info']}>
      <div className={styles['user-details-container']}>
        <Avatar
          src={userInfo?.picture || '/vendetta.png'}
          alt="User"
          size="medium"
        />
        <div className={styles['user-details']}>
          <div className={styles['user-name']}>{fullName}</div>
          <div className={styles['user-role']}>{userInfo?.role}</div>
        </div>
      </div>
      <DropdownMenu menuItems={menuItems} />
    </div>
  );
}

export default UserProfileSidebar;

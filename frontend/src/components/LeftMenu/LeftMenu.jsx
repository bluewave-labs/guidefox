import React from 'react';
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  SportsSoccerOutlined as SportsIcon,
  TipsAndUpdatesOutlined as TipsIcon,
  SmsOutlined as SmsIcon,
  LinkOutlined as LinkIcon,
} from '@mui/icons-material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import './LeftMenu.css';
import Logo from '../Logo/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfileSidebar from '../UserProfileSidebar/UserProfileSidebar';

const menuItems = [
  {
    text: 'Home',
    icon: <HomeIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/',
  },
  // { text: 'SERVE A CONTENT', title: true },
  // { text: 'Tours', icon: <DirectionsBusIcon />, route: '/tour' },
  {
    text: 'Hints',
    icon: <TipsIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/hint',
  },
  // { text: 'Checklist', icon: <ChecklistIcon /> },
  // { text: 'MAKE AN ANNOUNCEMENT', title: true },
  {
    text: 'Popups',
    icon: <SmsIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/popup',
  },
  {
    text: 'Banners',
    icon: <SportsIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/banner',
  },
  {
    text: 'Helper Links',
    icon: <LinkIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/link',
  },
  // { text: 'GET FEEDBACK', title: true },
  // { text: 'Feedback', icon: <ChatIcon /> },
  // { text: 'Surveys', icon: <ListIcon /> },
  {
    text: 'Support',
    icon: <SportsIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: 'https://github.com/bluewave-labs/bluewave-onboarding',
  },
  {
    text: 'Settings',
    icon: <SettingsOutlinedIcon style={{ color: 'var(--menu-icon-color)' }} />,
    route: '/settings',
  },
];

function LeftMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (route) => {
    if (route && route.startsWith('/')) {
      navigate(route);
    } else if (route) {
      window.open(route, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="left-menu">
      <div>
        <Logo isSidebar={true} />
        <List>
          {menuItems.map((item, index) =>
            item.title ? (
              <ListItemText key={index} primary={item.text} className="title" />
            ) : (
              <ListItemButton
                key={index}
                className="menu-item"
                sx={{
                  backgroundColor:
                    location.pathname === item.route
                      ? 'var(--gray-200)'
                      : 'transparent',
                }}
                onClick={() => handleNavigation(item.route)}
              >
                <ListItemIcon sx={{ color: 'var(--menu-icon-color)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )
          )}
        </List>
        {/* <Divider /> */}
      </div>
      <UserProfileSidebar />
    </div>
  );
}

export default LeftMenu;

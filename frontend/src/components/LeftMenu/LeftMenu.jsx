import React from 'react';
import { List, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import {
  DirectionsBusFilledOutlined as DirectionsBusIcon,
  HomeOutlined as HomeIcon,
  SportsSoccerOutlined as SportsIcon,
  TipsAndUpdatesOutlined as TipsIcon,
  ChecklistOutlined as ChecklistIcon,
  SmsOutlined as SmsIcon,
  LinkOutlined as LinkIcon,
  ListOutlined as ListIcon,
  MarkChatUnreadOutlined as ChatIcon,
} from '@mui/icons-material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import './LeftMenu.css';
import Logo from '../Logo/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfileSidebar from '../UserProfileSidebar/UserProfileSidebar';


const menuItems = [
  { text: 'Home', icon: <HomeIcon />, route: '/' },
  // { text: 'SERVE A CONTENT', title: true },
  // { text: 'Tours', icon: <DirectionsBusIcon />, route: '/tour' },
  { text: 'Hints', icon: <TipsIcon />, route: '/hint' },
  // { text: 'Checklist', icon: <ChecklistIcon /> },
  // { text: 'MAKE AN ANNOUNCEMENT', title: true },
  { text: 'Popups', icon: <SmsIcon />, route: '/popup' },
  { text: 'Banners', icon: <SportsIcon />, route: '/banner' },
  { text: 'Helper Links', icon: <LinkIcon />, route: '/link' },
  // { text: 'GET FEEDBACK', title: true },
  // { text: 'Feedback', icon: <ChatIcon /> },
  // { text: 'Surveys', icon: <ListIcon /> },
  { text: 'Support', icon: <SportsIcon />, route: 'https://github.com/bluewave-labs/bluewave-onboarding' },
  { text: 'Settings', icon: <SettingsOutlinedIcon />, route:'/settings' }
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
          {menuItems.map((item, index) => (
            item.title ? (
              <ListItemText key={index} primary={item.text} className="title" />
            ) : (
              <ListItemButton
                key={index}
                className="menu-item"
                sx={{
                  backgroundColor: location.pathname === item.route ? "var(--gray-200)" : "transparent"
                }}
                onClick={() => handleNavigation(item.route)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )
          ))}
        </List>
        {/* <Divider /> */}
      </div>
      <UserProfileSidebar />
    </div>
  );
}

export default LeftMenu;

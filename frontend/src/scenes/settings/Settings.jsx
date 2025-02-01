import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProfileTab from './ProfileTab/ProfileTab';
import PasswordTab from './PasswordTab/PasswordTab';
import styles from './Settings.module.css';
import TeamTab from './TeamTab/TeamTab';
import CodeTab from './CodeTab/CodeTab';
import { useAuth } from '../../services/authProvider';
import { renderIfAuthorized } from '../../utils/generalHelper';

export default function Settings() {
  const { userInfo } = useAuth();
  const role = userInfo?.role;
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.settings}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Profile" value="1" className={styles.tabLabel} />
              <Tab label="Password" value="2" className={styles.tabLabel} />
              {renderIfAuthorized(
                role,
                'admin',
                <Tab label="Team" value="3" className={styles.tabLabel} />
              )}
              {renderIfAuthorized(
                role,
                'admin',
                <Tab
                  label="API key & code"
                  value="4"
                  className={styles.tabLabel}
                />
              )}
            </TabList>
          </Box>
          <TabPanel value="1">
            <ProfileTab />
          </TabPanel>
          <TabPanel value="2">
            <PasswordTab />
          </TabPanel>
          {renderIfAuthorized(
            role,
            'admin',
            <TabPanel value="3">
              <TeamTab handleTabChange={handleChange} />
            </TabPanel>
          )}
          {renderIfAuthorized(
            role,
            'admin',
            <TabPanel value="4">
              <CodeTab />
            </TabPanel>
          )}
        </TabContext>
      </Box>
    </Box>
  );
}

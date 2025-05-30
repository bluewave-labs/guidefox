import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@mui/material';
import './EditorTabs.css';

const EditorTabs = ({ mode, setMode, sx }) => (
  <Tabs
    className="editor-tabs"
    value={mode}
    onChange={(event, newValue) => setMode(newValue)}
    TabIndicatorProps={{
      style: {
        display: 'none',
      },
    }}
    sx={sx}
  >
    <Tab className="tab" label="Editor" value="editor" />
    <Tab className="tab" label="Preview" value="preview" />
  </Tabs>
);

EditorTabs.propTypes = {
  mode: PropTypes.string,
  setMode: PropTypes.func,
  sx: PropTypes.object,
};

export default EditorTabs;

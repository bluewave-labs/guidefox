import React from 'react';
import { Box, IconButton, Toolbar } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatQuote,
  Link,
  Image,
  FormatListBulleted,
  FormatListNumbered,
} from '@mui/icons-material';

const EditorDesign = () => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px',
        width: '300px',
        margin: '20px auto',
      }}
    >
      <Toolbar variant="dense">
        <IconButton>
          <FormatBold />
        </IconButton>
        <IconButton>
          <FormatItalic />
        </IconButton>
        <IconButton>
          <FormatUnderlined />
        </IconButton>
        <IconButton>
          <Code />
        </IconButton>
        <IconButton>
          <FormatQuote />
        </IconButton>
        <IconButton>
          <Link />
        </IconButton>
        <IconButton>
          <Image />
        </IconButton>
        <IconButton>
          <FormatListBulleted />
        </IconButton>
        <IconButton>
          <FormatListNumbered />
        </IconButton>
      </Toolbar>
    </Box>
  );
};

export default EditorDesign;

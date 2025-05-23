import React, { useState } from 'react';
import { Box, Button, InputAdornment, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Divider from '@mui/material/Divider';
import CustomTextField from './CustomTextField/CustomTextField';
import './TextFieldComponents.css';

const TextFieldComponents = () => {
  const [values, setValues] = useState({
    website: 'www.untitledui.com',
    website1: 'www.untitledui.com',
    email: 'olivia@untitledui.com',
    email1: 'olivia@untitledui.com',
    email2: 'olivia@untitledui.com',
    description: '',
    description1: 'Marketing',
    description2: '',
  });

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  return (
    <Box className="textField-container">
      <Box className="textField-section-left" sx={{ minWidth: 200 }}>
        <CustomTextField
          labelText="Website"
          value={values.website}
          onChange={handleChange('website')}
          startAdornment=<>
            <InputAdornment position="start">http://</InputAdornment>
            <Divider sx={{ height: 34, m: 0.5 }} orientation="vertical" />
          </>
          helperText="This is a hint text to help user."
          endAdornment=<Tooltip title="This is a Tooltip" placement="top" arrow>
            <HelpOutlineIcon />
          </Tooltip>
        />

        <CustomTextField
          labelText="Email"
          value={values.email}
          onChange={handleChange('email')}
          helperText="This is a hint text to help user."
        />

        <CustomTextField
          labelText="Email"
          value={values.email1}
          onChange={handleChange('email1')}
          error
          helperText="This is an error message."
          endAdornment=<ErrorOutlineIcon
            style={{ color: 'var(--border-error-solid)' }}
          />
        />

        <CustomTextField
          labelText="Email"
          value={values.email2}
          onChange={handleChange('email2')}
          helperText="This is a hint text to help user."
          endAdornment=<HelpOutlineIcon />
        />

        <CustomTextField
          labelText="Website"
          labelFontWeight={400}
          TextFieldWidth="397px"
          value={values.website1}
          onChange={handleChange('website1')}
          helperText="This is a hint text to help user."
          endAdornment=<>
            <HelpOutlineIcon />
            <Divider sx={{ height: 34, m: 0.5 }} orientation="vertical" />
            <Button variant="outline" startIcon={<ContentCopyIcon />}>
              Copy
            </Button>
          </>
        />
      </Box>

      <Box className="textField-section-right" sx={{ minWidth: 300 }}>
        <CustomTextField
          labelText="Description"
          value={values.description}
          onChange={handleChange('description')}
          placeholder="Enter a description..."
          helperText="This is a hint text to help user."
          multiline={true}
          rows={4}
        />

        <CustomTextField
          labelText="Description"
          helperText="This is a hint text to help user."
          multiline={true}
          value={values.description1}
          onChange={handleChange('description1')}
          rows={4}
          chips={[
            { label: 'Design', onDelete: () => {} },
            { label: 'Software', onDelete: () => {} },
          ]}
        />

        <CustomTextField
          labelText="Description"
          value={values.description2}
          onChange={handleChange('description2')}
          placeholder="Enter a description..."
          helperText="This is an error message."
          multiline={true}
          rows={4}
          error
        />
      </Box>
    </Box>
  );
};

export default TextFieldComponents;

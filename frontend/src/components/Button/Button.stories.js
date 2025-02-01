import Button from './Button';

// Storybook display settings
export default {
  title: 'Interactables/Button',
  component: Button,
  argTypes: {
    text: {
      control: { type: 'text' },
      defaultValue: 'Click Me',
    },
    onClick: {
      action: 'clicked',
    },
    variant: {
      control: { type: 'radio', options: ['text', 'outlined', 'contained'] },
      defaultValue: 'contained',
    },
    style: {
      control: { type: 'object' },
    },
    sx: {
      control: { type: 'object' },
    },
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    buttonType: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary-grey', 'secondary-purple', 'error'],
      },
      defaultValue: 'primary',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

// Default Button story
export const Default = {
  args: {
    text: 'Click Me',
    onClick: () => {},
    variant: 'contained',
    style: null,
    sx: null,
    disabled: false,
    buttonType: 'primary',
  },
};

// Secondary Button story
export const SecondaryGrey = {
  args: {
    text: 'Secondary Grey Button',
    onClick: () => {},
    variant: 'contained',
    style: null,
    sx: null,
    disabled: false,
    buttonType: 'secondary-grey',
  },
};

// Error Button story
export const Error = {
  args: {
    text: 'Error Button',
    onClick: () => {},
    variant: 'contained',
    style: null,
    sx: null,
    disabled: false,
    buttonType: 'error',
  },
};

// Outlined Button story
export const Outlined = {
  args: {
    text: 'Outlined Button',
    onClick: () => {},
    variant: 'outlined',
    style: null,
    sx: null,
    disabled: false,
    buttonType: 'primary',
  },
};

// Disabled Button story
export const Disabled = {
  args: {
    text: 'Disabled Button',
    onClick: () => {},
    variant: 'contained',
    style: null,
    sx: null,
    disabled: true,
    buttonType: 'primary',
  },
};

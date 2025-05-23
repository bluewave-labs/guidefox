import CheckIcon from './CheckIcon';

//Storybook display settings
export default {
  title: 'Visuals/CheckIcon',
  component: CheckIcon,
  argTypes: {
    type: {
      options: ['outline', 'solid'],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    color: {
      options: ['purple', 'black', 'green'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

//Stories for each Check circle type
export const PurpleOutline = {
  args: {
    type: 'outline',
    size: 'medium',
    color: 'purple',
  },
};

export const BlackOutline = {
  args: {
    type: 'outline',
    size: 'medium',
    color: 'black',
  },
};

export const GreenOutline = {
  args: {
    type: 'outline',
    size: 'medium',
    color: 'green',
  },
};

export const PurpleSolid = {
  args: {
    type: 'solid',
    size: 'medium',
    color: 'purple',
  },
};

export const BlackSolid = {
  args: {
    type: 'solid',
    size: 'medium',
    color: 'black',
  },
};

export const GreenSolid = {
  args: {
    type: 'solid',
    size: 'medium',
    color: 'green',
  },
};

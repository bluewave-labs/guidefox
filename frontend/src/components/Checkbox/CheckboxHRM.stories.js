import Checkbox from './CheckboxHRM';

//Storybook display settings
export default {
  title: 'Interactables/Checkbox',
  component: Checkbox,
  argTypes: {
    enabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

//Stories for each checkbox type
export const Box = {
  args: {
    type: 'checkbox',
    id: 'test',
    name: 'name',
    value: 'value',
    onChange: () => {},
  },
};

export const Radio = {
  args: {
    type: 'radio',
    id: 'test',
    name: 'name',
    value: 'value',
    onChange: () => {},
  },
};

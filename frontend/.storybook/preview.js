/** @type { import('@storybook/react').Preview } */
import "../src/styles/variables.css";
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

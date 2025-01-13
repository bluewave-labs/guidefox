import pluginJs from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { 'no-unused-vars': ['warn', { destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true }] },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];

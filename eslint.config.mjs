import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: ['node_modules', '__tests__', '__mocks__', 'out', '.next'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },

  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier'],
    globals: {
      React: 'readonly',
    },
    rules: {
      semi: ['warn', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }),
];
export default eslintConfig;

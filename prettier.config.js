const prettierBaseConfig = {
  $schema: 'https://json.schemastore.org/prettierrc',
  plugins: [
    'prettier-plugin-jsdoc',
    'prettier-plugin-packagejson',
    'prettier-plugin-organize-imports',
  ],
  organizeImportsSkipDestructiveCodeActions: true,
  printWidth: 100,
  proseWrap: 'always',
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  bracketSpacing: true,
  tabWidth: 2,
};

export default prettierBaseConfig;

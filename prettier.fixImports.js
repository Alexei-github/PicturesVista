import prettierBaseConfig from './prettier.config.js';

const prettierCofigFix = {
  ...prettierBaseConfig,
  organizeImportsSkipDestructiveCodeActions: false,
};

export default prettierCofigFix;

module.exports = {
  extends: ['expo', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'backend/dist/',
    '.expo/',
  ],
  rules: {
    // Add any custom rules here
  },
};

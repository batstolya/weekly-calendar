module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
  },
};

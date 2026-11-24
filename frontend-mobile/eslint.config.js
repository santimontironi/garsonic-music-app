// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // falso positivo con axios.create(), la forma estándar de usar axios (igual que en frontend-web)
      'import/no-named-as-default-member': 'off',
    },
  },
]);

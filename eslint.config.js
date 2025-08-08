const tseslint = require("typescript-eslint");
const prettier = require("eslint-plugin-prettier/recommended");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [...tseslint.configs.recommended],
    rules: {
      "no-unused-vars": "warn",

      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  prettier,
);

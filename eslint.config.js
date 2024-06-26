import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  ignores: [
    "**/node_modules/**",
    "**/lib/**",
    "**/dist/**",
    "**/coverage/**",
    "**/reports/**",
    "**/public/**",
    "**/out/**",
    "**/.husky/**",
  ],
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },

  languageOptions: {
    sourceType: "module",
    parser: tseslint.parser,
    parserOptions: {
      sourceType: "module",
      tsconfigRootDir: "./configs",
      project: ["./tsconfig.lint.json"],
    },
  },

  files: ["src/**/*.ts"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  },
});

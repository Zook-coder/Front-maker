import pluginJs from "@eslint/js";
import parser from '@typescript-eslint/parser';
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { 
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        project: true
      }
    }
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintPluginPrettier,
  {
    ignores: [
      'eslint.config.mjs',
      '.next/**',
      '**/*.{js,mjs}',
      "src/components/ui/**/*.{tsx}"
    ],
  }
];
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "eslint.config.js"],
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...(importPlugin.configs?.recommended?.rules ?? {}),

      "prettier/prettier": "error",
      "no-console": "off",

      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    },
  },

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      // IMPORTANT: TS handles this, ESLint no-undef breaks with .d.ts globals
      "no-undef": "off",

      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/return-await": "off",
      "no-console": "off",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "prettier/prettier": "error",

      "no-restricted-syntax": [
        "error",
        {
          selector: "LabeledStatement",
          message:
            "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],

      "@typescript-eslint/no-inferrable-types": "off",
      "import/prefer-default-export": "off",
      "import/no-cycle": "off",
      "no-await-in-loop": "off",
    },
  },
];

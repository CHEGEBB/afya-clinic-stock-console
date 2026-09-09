import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    rules: {
      // Catch dead code / unused imports — easy to accumulate in a fast-moving build
      "@typescript-eslint/no-unused-vars": "error",
      // Disabled: this codebase has a lot of plain-English copy (item names, labels)
      // with apostrophes/quotes; escaping every one hurts readability for no real benefit.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // Test files use Jest's global functions (describe, it, expect, etc.)
    // without importing them — this tells ESLint those names are valid here.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
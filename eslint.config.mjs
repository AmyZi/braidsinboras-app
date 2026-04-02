import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const relaxedRules = {
  "no-undef": "off",
  "no-unused-vars": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "@typescript-eslint/triple-slash-reference": "off",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
};

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/sitemap*.xml"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...relaxedRules,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...relaxedRules,
    },
  },
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];
// @ts-nocheck

/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: ["**/generated/generated.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-ty": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/prefer-includes": "off",
    "@typescript-eslint/prefer-promise-reject-errors": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};
module.exports = config;

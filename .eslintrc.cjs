/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: ["**/generated/generated.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  // @ts-expect-error - plugin works, but has wrong type
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/require-await": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};
module.exports = config;

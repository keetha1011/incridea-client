/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  tabWidth: 2,
  useTabs: false,
  importOrder: [
    "^@core/(.*)$",
    "^@server/(.*)$",
    "^@ui/(.*)$",
    "~/server/(.*)$",
    "~/pages/(.*)$",
    "~/components/ui/(.*)$",
    "~/(.*)",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderCaseInsensitive: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;

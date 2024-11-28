import { PluginOptions } from "prettier-plugin-tailwindcss";
import { PluginConfig } from "@trivago/prettier-plugin-sort-imports";
import { Config } from "prettier";

const importConfig: PluginConfig = {
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
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  // importOrderParserPlugins: [],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

const tailwindConfig: PluginOptions = {
  tailwindConfig: "./tailwind.config.ts",
  // tailwindAttributes: [],
  // tailwindFunctions: [],
  tailwindStylesheet: "./src/styles/globals.css",
};

const config: Config = {
  tabWidth: 2,
  useTabs: false,
  ...importConfig,
  ...tailwindConfig,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;

import { CodegenConfig } from "@graphql-codegen/cli";

import { env } from "./src/env";

const config: CodegenConfig = {
  schema: `${env.NEXT_PUBLIC_SERVER_URL}/graphql`,
  documents: "./src/**/*.graphql",
  generates: {
    "./src/generated/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
};

export default config;

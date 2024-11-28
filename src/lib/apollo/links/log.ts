import { env } from "~/env";

import { ApolloLink, FetchResult, NextLink, Operation } from "@apollo/client";
import { getOperationAST, OperationTypeNode } from "graphql";

const palettes = {
  css: {
    query: ["72e3ff", "3fb0d8"],
    mutation: ["c5a3fc", "904dfc"],
    subscription: ["ff49e1", "d83fbe"],
  },
  ansi: {
    regular: {
      // Cyan background, black and white text respectively
      query: ["\x1b[30;46m", "\x1b[97;46m"],
      // Magenta background, black and white text respectively
      mutation: ["\x1b[30;45m", "\x1b[97;45m"],
      // Green background, black and white text respectively
      subscription: ["\x1b[30;42m", "\x1b[97;42m"],
    },
    bold: {
      query: ["\x1b[1;30;46m", "\x1b[1;97;46m"],
      mutation: ["\x1b[1;30;45m", "\x1b[1;97;45m"],
      subscription: ["\x1b[1;30;42m", "\x1b[1;97;42m"],
    },
  },
} as const;

class LogLink extends ApolloLink {
  operationCount: number;

  constructor() {
    super();
    this.operationCount = 0;
  }

  handleLogging({
    id,
    direction,
    input,
    name,
    type,
  }: {
    id: number;
    direction: "up" | "down";
    input: object;
    name: string;
    type: OperationTypeNode;
  }) {
    const colorMode = typeof window === "undefined" ? "ansi" : "css";
    const parts: string[] = [];
    const args: any[] = [];

    console.log(input);

    switch (colorMode) {
      case "ansi":
        const [lightRegular, darkRegular] = palettes.ansi.regular[type];
        const [lightBold, darkBold] = palettes.ansi.bold[type];
        parts.push(
          direction === "up" ? lightRegular : darkRegular,
          ">>",
          type,
          direction === "up" ? lightBold : darkBold,
          `#${id}`,
          name,
          "\x1b[0m",
        );
        break;
      case "css":
        const [light, dark] = palettes.css[type];
        const css = `background-color: #${direction === "up" ? light : dark};color: ${direction === "up" ? "black" : "white"};padding: 2px;`;
        parts.push(
          "%c",
          direction === "up" ? ">>" : "<<",
          type,
          `#${id}`,
          `%c${name}%c`,
          "%O",
        );
        args.push(
          css,
          `${css} font-weight: bold;`,
          `${css} font-weight: normal;`,
        );
        break;
    }

    args.push(
      typeof window === "undefined" ? JSON.stringify(input, null, 2) : input,
    );

    console.log(parts.join(" "), ...args);

    return input;
  }

  request(operation: Operation, forward: NextLink) {
    if (env.NEXT_PUBLIC_LOGGING_DISABLED) return forward(operation);

    const definition = getOperationAST(
      operation.query,
      operation.operationName,
    );
    if (!definition || definition.kind !== "OperationDefinition")
      return forward(operation);

    this.operationCount += 1;

    const id = this.operationCount;

    this.handleLogging({
      id: id,
      direction: "up",
      input: operation,
      name: operation.operationName,
      type: definition.operation,
    });

    return forward(operation).map((result) =>
      this.handleLogging({
        id: id,
        direction: "down",
        input: result,
        name: operation.operationName,
        type: definition.operation,
      }),
    );
  }
}

export { LogLink };

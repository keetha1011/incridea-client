import { ApolloLink } from "@apollo/client";

import { env } from "~/env";

const logLink = new ApolloLink((operation, forward) => {
  if (env.NEXT_PUBLIC_LOGGING_DISABLED) return forward(operation);

  console.time(operation.operationName);
  console.log(
    `\n[GraphQL Request]:`,
    JSON.stringify(
      {
        operationName: operation.operationName,
        variables: operation.variables,
        query: operation.query,
      },
      null,
      2,
    ),
  );

  return forward(operation).map((result) => {
    console.timeEnd(operation.operationName);
    console.log(
      `\n[GraphQL Response]:`,
      JSON.stringify(
        {
          operationName: operation.operationName,
          headers: operation.getContext().response.headers,
          result: result,
        },
        null,
        2,
      ),
    );

    return result;
  });
});

export { logLink };

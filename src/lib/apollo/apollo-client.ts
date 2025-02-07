import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { from, split } from "@apollo/client/link/core";
import { HttpLink } from "@apollo/client/link/http";
import { getOperationAST, Kind, OperationTypeNode } from "graphql";
import { getSession } from "next-auth/react";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { env } from "~/env";
import { LogLink } from "~/lib/apollo/links/log";

const URI = `${env.NEXT_PUBLIC_SERVER_URL}/graphql`;

const wsLink = new GraphQLWsLink(
  createClient({
    // url: env.NEXT_PUBLIC_SERVER_WEBSOCKET_URL,
    url: `${env.NEXT_PUBLIC_SERVER_WEBSOCKET_URL}/graphql`,
    connectionParams: async () => {
      const session = await getSession();
      const token = session?.accessToken;

      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  }),
);

const logLink = new LogLink();

const authLink = setContext(async (_, prevContext) => {
  if (typeof window === "undefined") return prevContext;

  const session = await getSession();
  const token = session?.accessToken;

  return {
    ...prevContext,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      ...prevContext.headers,
    },
  };
});

const httpLink = new HttpLink({
  uri: URI,
});

const splitLink = split(
  ({ query, operationName }) => {
    const definition = getOperationAST(query, operationName);

    return (
      definition?.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const createApolloClient = () => {
  return new ApolloClient({
    link: from([logLink, splitLink]),
    cache: new InMemoryCache(),
  });
};

export { createApolloClient };

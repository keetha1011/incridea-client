import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { from, split } from "@apollo/client/link/core";
import { HttpLink } from "@apollo/client/link/http";
import { getOperationAST } from "graphql";
import { getSession } from "next-auth/react";

import { env } from "~/env";
import { logLink } from "~/lib/apollo/links/log";
import { SSELink } from "~/lib/apollo/links/sse";

const URI = `${env.NEXT_PUBLIC_SERVER_URL}/graphql`;

const sseLink = new SSELink({
  uri: URI,
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.accessToken;

  return {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      ...headers,
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
      definition?.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  sseLink,
  authLink.concat(httpLink),
);

export default function createApolloClient() {
  return new ApolloClient({
    link: from([logLink, splitLink]),
    cache: new InMemoryCache(),
  });
}

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import typeDefs from '../api/schema'
import merge from 'lodash/merge'

const defaultMocks = {
  Query: () => ({
    nodes: () => []
  }),
  Mutation: () => ({
    getDomainState: (_, { name }, context) => {
      return {
        name,
        state: 'Open'
      }
    }
  })
}

function createGraphQLClient(mocks = defaultMocks) {
  mocks = merge(defaultMocks, mocks)

  const schema = makeExecutableSchema({ typeDefs })
  addMockFunctionsToSchema({
    schema,
    mocks
  })

  const apolloCache = new InMemoryCache(window.__APOLLO_STATE__)

  const graphqlClient = new ApolloClient({
    cache: apolloCache,
    link: new SchemaLink({ schema })
  })

  return graphqlClient
}

export default createGraphQLClient

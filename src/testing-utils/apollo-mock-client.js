import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import merge from 'lodash/merge'

function setupClient(mockResolvers, typeDefs) {
  return function createClient(overwriteMocks = {}) {
    const mergedMocks = merge(mockResolvers, overwriteMocks)

    const schema = makeExecutableSchema({ typeDefs })
    addMockFunctionsToSchema({
      schema,
      mocks: mergedMocks
    })

    const apolloCache = new InMemoryCache(window.__APOLLO_STATE__)

    const graphqlClient = new ApolloClient({
      cache: apolloCache,
      link: new SchemaLink({ schema })
    })

    return graphqlClient
  }
}

export default setupClient

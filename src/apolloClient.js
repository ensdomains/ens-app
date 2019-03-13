import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'

const cache = new InMemoryCache({
  addTypename: true
})

const client = new ApolloClient({
  cache,
  addTypename: true,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})

export default client

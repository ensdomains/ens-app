import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'

const cache = new InMemoryCache({
  addTypename: true
})

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPH_NODE_URI
})

const stateLink = withClientState({
  resolvers,
  cache,
  defaults,
  typeDefs
})

const client = new ApolloClient({
  cache,
  addTypename: true,
  link: ApolloLink.from([stateLink, httpLink], cache)
})

export default client

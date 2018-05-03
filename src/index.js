import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from './api/resolvers/rootResolver'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'

const cache = new InMemoryCache(window.__APOLLO_STATE__)

const graphqlClient = new ApolloClient({
  cache,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()

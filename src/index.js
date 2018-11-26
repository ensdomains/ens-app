import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'
import { GlobalStateProvider } from './globalState'
import './globalStyles'
import setupWeb3 from './api/web3'

const cache = new InMemoryCache({
  addTypename: true
})

const graphqlClient = new ApolloClient({
  cache,
  addTypename: true,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})
window.addEventListener('load', () => {
  setupWeb3()
})

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

registerServiceWorker()

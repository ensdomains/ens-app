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
import { NotificationsProvider } from './Notifications'
import { GlobalStateProvider } from './globalState'
import './globalStyles'

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

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <GlobalStateProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </GlobalStateProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import setupWeb3 from './api/web3'
import getENS from './api/ens'
import { SET_ERROR } from './graphql/mutations'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'
import { GlobalStateProvider } from './globalState'
import './globalStyles'

const cache = new InMemoryCache({
  addTypename: true
})

export const client = new ApolloClient({
  cache,
  addTypename: true,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})

window.addEventListener('load', async () => {
  await setupWeb3()
  try {
    await getENS()
  } catch (e) {
    await client.mutate({
      mutation: SET_ERROR,
      variables: { message: e.message }
    })
  }
  ReactDOM.render(
    <ApolloProvider client={client}>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})

registerServiceWorker()

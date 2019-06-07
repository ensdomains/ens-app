import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import Web3 from 'web3'

import App from 'App'
import { setupWeb3 } from '@ensdomains/ui'
import { getENS } from '@ensdomains/ui'
import { SET_ERROR } from 'graphql/mutations'

import client from 'apolloClient'
import { GlobalStateProvider } from 'globalState'
import 'globalStyles'

window.addEventListener('load', async () => {
  await setupWeb3({ Web3 })
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

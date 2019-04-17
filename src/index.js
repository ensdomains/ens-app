import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import App from 'App'
import setupWeb3 from 'api/web3'
import getENS from 'api/ens'
import { SET_ERROR } from 'graphql/mutations'

import client from 'apolloClient'
import { GlobalStateProvider } from 'globalState'
import 'globalStyles'

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

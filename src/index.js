import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import App from 'App'
import { setupENS } from '@ensdomains/ui'
import { SET_ERROR } from 'graphql/mutations'

import client from 'apolloClient'
import { GlobalStateProvider } from 'globalState'
import 'globalStyles'

import '@ethvault/iframe-provider-polyfill'

window.addEventListener('load', async () => {
  try {
    await setupENS({ reloadOnAccountsChange: true })
  } catch (e) {
    console.log(e)
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

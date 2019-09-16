import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import 'core-js/es/object'
import App from 'App'
import { setupENS } from '@ensdomains/ui'
import { SET_ERROR } from 'graphql/mutations'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import { setupClient } from 'apolloClient'

window.addEventListener('load', async () => {
  let client
  try {
    client = await setupClient()
    try {
      await setupENS({ reloadOnAccountsChange: true })
    } catch (e) {
      console.warn('setupENS', e)
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
  } catch (e) {
    console.error('setupClient', e)
  }
})

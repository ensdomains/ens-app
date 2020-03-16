import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import 'core-js/es/object'
import App from 'App'
import { setup } from './api/ens'
import { SET_ERROR } from 'graphql/mutations'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import { setupClient } from 'apolloClient'
import { getNetworkId } from '@ensdomains/ui'

window.addEventListener('load', async () => {
  let client

  try {
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      await setup({
        reloadOnAccountsChange: true,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
      let labels = window.localStorage['labels'] ? JSON.parse(labelsJSON) : {}
      // a test label for testing new subdomain
      const testLabels = {
        f66494dcc1f75a779961a5e1e042022f740297f85ecacf57ab91f3e099338a38: 'okay'
      }
      window.localStorage.setItem(
        'labels',
        JSON.stringify({
          ...labels,
          ...JSON.parse(process.env.REACT_APP_LABELS),
          ...testLabels
        })
      )
    } else {
      await setup({
        reloadOnAccountsChange: false
      })
    }
    const networkId = await getNetworkId()
    client = await setupClient(networkId)
  } catch (e) {
    console.log(e)
    client = await setupClient()
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

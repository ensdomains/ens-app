import React, { Suspense } from 'react'
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
import './i18n'

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
      let labels = window.localStorage['labels']
        ? JSON.parse(window.localStorage['labels'])
        : {}
      window.localStorage.setItem(
        'labels',
        JSON.stringify({
          ...labels,
          ...JSON.parse(process.env.REACT_APP_LABELS)
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
    <Suspense fallback={null}>
      <ApolloProvider client={client}>
        <GlobalStateProvider>
          <App />
        </GlobalStateProvider>
      </ApolloProvider>
    </Suspense>,
    document.getElementById('root')
  )
})

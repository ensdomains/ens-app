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
      let labelsJSON = window.localStorage['labels']
      let labels
      if (labelsJSON) {
        labels = JSON.parse(labelsJSON)
      } else {
        labels = {}
      }
      // labels[
      //   '03bd642dd09510c5661d684107f8c8616af5a619c17a899a90b36056efa59411'
      // ] = 'subdomaindummy'
      // labels[
      //   '8cfce3846b2a51b94d2cc5646dc3b6249f78c82e2441b3d32e2a1e6feb93ee49'
      // ] = 'original'
      // labels[
      //   'f66494dcc1f75a779961a5e1e042022f740297f85ecacf57ab91f3e099338a38'
      // ] = 'okay'
      // window.localStorage.setItem('labels', JSON.stringify(labels))
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

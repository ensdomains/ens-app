import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import 'core-js/es/object'
import App from 'App'
import { setupENS, getWeb3 } from '@ensdomains/ui'
import { SET_ERROR } from 'graphql/mutations'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import { setupClient } from 'apolloClient'

import { isWalletConnect, getWCIfConnected } from './connectWC'
import { GET_WC_STATE } from './components/NetworkInformation/WCstateQuery'

window.addEventListener('load', async () => {
  let client

  try {
    client = await setupClient()
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      await setupENS({
        reloadOnAccountsChange: true,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
    } else {
      // false if no previous connection to WC
      // or previous connection was terminated outside of page context
      // (without clearing localStorage.walletconnect)
      const customProvider = wasLastProviderWC() && await getWCIfConnected({
        onDisconnect: () => client && client.query({query: GET_WC_STATE, fetchPolicy: 'network-only'})
      })

      await setupENS({
        reloadOnAccountsChange: false,
        customProvider,
      })
    }
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


const wasLastProviderWC = () => localStorage.getItem('lastProvider') === 'WalletConnect'

window.addEventListener('unload', async () => {
  const provider = await getWeb3()

  const providerType = isWalletConnect(provider) ? 'WalletConnect' : 'default'
  window.localStorage.setItem('lastProvider', providerType)
})
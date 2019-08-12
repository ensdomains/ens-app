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

async function getNetwork() {
  let network

  if (window.ethereum) {
    network = window.ethereum.networkVersion
  } else if (window.web3) {
    network = await new Promise((resolve, reject) => {
      window.version.web3.getNetwork((err, network) => {
        resolve(network)
      })
    })
  }

  return network
}

window.addEventListener('load', async () => {
  let client
  let ensAddress

  const networkId = await getNetwork()
  //TODO: remove
  if (process.env.REACT_APP_ENS_ADDRESS && networkId > 1000) {
    //Assuming public main/test networks have a networkId of less than 1000
    ensAddress = process.env.REACT_APP_ENS_ADDRESS
  }

  try {
    client = await setupClient(networkId)
    await setupENS({ reloadOnAccountsChange: true, ensAddress })
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

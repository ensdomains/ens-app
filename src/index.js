import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client'

import App from 'App'
// import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import './i18n'
import { handleNetworkChange } from './utils/utils'

const setup = async () => {}
setup()

window.addEventListener('load', async () => {
  const { client, networkId } = await handleNetworkChange()
  ReactDOM.render(
    <Suspense fallback={null}>
      <ApolloProvider {...{ client }}>
        <App initialClient={client} initialNetworkId={networkId} />
      </ApolloProvider>
    </Suspense>,
    document.getElementById('root')
  )
})

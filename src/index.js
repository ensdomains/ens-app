import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client'

import App from 'App'
import 'globalStyles'
import './i18n'
import setup from './setup'
import { clientReactive, networkIdReactive } from './apollo/reactiveVars'
import { setupClient } from './apollo/apolloClient'

setup()
window.addEventListener('load', async () => {
  const client = clientReactive(setupClient(networkIdReactive()))
  ReactDOM.render(
    <Suspense fallback={null}>
      <ApolloProvider {...{ client }}>
        <App />
      </ApolloProvider>
    </Suspense>,
    document.getElementById('root')
  )
})

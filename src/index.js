import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import App from 'App'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import './i18n'
import { handleNetworkChange } from './utils/utils'

window.addEventListener('load', async () => {
  const { client, networkId } = await handleNetworkChange()
  console.log('networkId: ', networkId)
  ReactDOM.render(
    <Suspense fallback={null}>
      <GlobalStateProvider>
        <App initialClient={client} initialNetworkId={networkId} />
      </GlobalStateProvider>
    </Suspense>,
    document.getElementById('root')
  )
})

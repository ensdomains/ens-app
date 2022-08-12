import { getAccounts, getNetwork, getNetworkId } from '@pnsdomains/ui'

import { isReadOnly } from '@pnsdomains/ui/src/web3'

import { setup } from './apollo/mutations/ens'
import { connect } from './api/web3modal'
import {
  accountsReactive,
  favouritesReactive,
  globalErrorReactive,
  isAppReadyReactive,
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  subDomainFavouritesReactive,
  web3ProviderReactive
} from './apollo/reactiveVars'
import { setupAnalytics } from './utils/analytics'
import { getReverseRecord } from './apollo/sideEffects'
import { safeInfo, setupSafeApp } from './utils/safeApps'

export const setFavourites = () => {
  favouritesReactive(
    JSON.parse(window.localStorage.getItem('ensFavourites')) || []
  )
}

export const setSubDomainFavourites = () => {
  subDomainFavouritesReactive(
    JSON.parse(window.localStorage.getItem('ensSubDomainFavourites')) || []
  )
}

export const isSupportedNetwork = networkId => {
  switch (networkId) {
    case 43113:
      return true
    case 941:
      return true
    default:
      return false
  }
}

export const getProvider = async reconnect => {
  try {
    let provider
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      const { providerObject } = await setup({
        reloadOnAccountsChange: false,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
      provider = providerObject
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
      return provider
    }

    const safe = await safeInfo()
    if (safe) {
      const provider = await setupSafeApp(safe)
      return provider
    }

    if (
      window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') ||
      reconnect
    ) {
      provider = await connect()
      return provider
    }

    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false
    })
    provider = providerObject
    return provider
  } catch (e) {
    if (e.message.match(/Unsupported network/)) {
      globalErrorReactive('Unsupported Network')
      return
    }
  }

  try {
    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false
    })
    provider = providerObject
    return provider
  } catch (e) {
    console.error('getProvider readOnly error: ', e)
  }
}

export const setWeb3Provider = async provider => {
  web3ProviderReactive(provider)

  const accounts = await getAccounts()

  if (provider) {
    provider.removeAllListeners()
    accountsReactive(accounts)
  }

  provider?.on('chainChanged', async _chainId => {
    const networkId = await getNetworkId()
    if (!isSupportedNetwork(networkId)) {
      globalErrorReactive('Unsupported Network')
      return
    }
    networkIdReactive(networkId)
    networkReactive(await getNetwork())
  })

  provider?.on('accountsChanged', async accounts => {
    accountsReactive(accounts)
  })

  return provider
}

export default async reconnect => {
  try {
    setFavourites()
    setSubDomainFavourites()
    const provider = await getProvider(reconnect)

    if (!provider) throw 'Please install a wallet'

    const networkId = await getNetworkId()

    if (!isSupportedNetwork(networkId)) {
      globalErrorReactive('Unsupported Network')
      return
    }

    networkIdReactive(await getNetworkId())
    networkReactive(await getNetwork())

    await setWeb3Provider(provider)

    if (accountsReactive?.[0]) {
      reverseRecordReactive(await getReverseRecord(accountsReactive?.[0]))
    }

    isReadOnlyReactive(isReadOnly())

    setupAnalytics()

    isAppReadyReactive(true)
  } catch (e) {
    console.error('setup error: ', e)
  }
}

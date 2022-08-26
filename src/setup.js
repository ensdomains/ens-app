import {
  getAccounts,
  getNetwork,
  getNetworkId,
  isReadOnly
} from '@ensdomains/ui'
import { connect } from './api/web3modal'
import { setup } from './apollo/mutations/ens'
import {
  accountsReactive,
  delegatesReactive,
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
import { getReverseRecord } from './apollo/sideEffects'
import { rpcUrl } from './rpcUrl'
import { setupAnalytics } from './utils/analytics'
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
    case 1:
    case 3:
    case 4:
    case 5:
    case 1337:
    case 31337:
      return true
    default:
      return false
  }
}

const handleUnsupportedNetwork = (provider = window.ethereum) => {
  if (provider) {
    provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }]
    })
    provider.on('chainChanged', function(networkId) {
      window.location.reload()
    })
  }
  globalErrorReactive({
    ...globalErrorReactive(),
    network: 'Unsupported Network'
  })
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
      customProvider: rpcUrl,
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false
    })
    provider = providerObject
    return provider
  } catch (e) {
    if (e.error && e.error.message.match(/Unsupported network/)) {
      handleUnsupportedNetwork(e.provider)
      return
    }
  }

  try {
    const { providerObject } = await setup({
      customProvider: rpcUrl,
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
    if (provider.events?.removeAllListeners)
      provider.events.removeAllListeners()
    accountsReactive(accounts)
  }

  provider?.on('chainChanged', async _chainId => {
    const networkId = await getNetworkId()
    if (!isSupportedNetwork(networkId)) {
      handleUnsupportedNetwork(provider)
      return
    }

    await setup({
      customProvider: provider,
      reloadOnAccountsChange: false,
      enforceReload: true
    })

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
      handleUnsupportedNetwork(provider)
      return
    }

    networkIdReactive(await getNetworkId())
    networkReactive(await getNetwork())

    await setWeb3Provider(provider)

    if (accountsReactive?.[0]) {
      reverseRecordReactive(await getReverseRecord(accountsReactive?.[0]))
      delegatesReactive(await getShouldDelegate(accountsReactive?.[0]))
    }

    isReadOnlyReactive(isReadOnly())

    setupAnalytics()

    isAppReadyReactive(true)
  } catch (e) {
    console.error('setup error: ', e)
  }
}

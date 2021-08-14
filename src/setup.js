import StackdriverErrorReporter from 'stackdriver-errors-js'
import {
  getAccounts,
  getNetwork,
  getNetworkId,
  getWeb3,
  isDecrypted,
  isReadOnly,
  labelhash,
  utils
} from '@ensdomains/ui'

import { setup } from './apollo/mutations/ens'
import { connect } from './api/web3modal'
import {
  setWeb3ProviderLocalMutation,
  getNetworkMutation,
  getReverseRecordMutation,
  getAccountsMutation,
  getNetworkIdMutation,
  getIsReadOnlyMutation,
  getIsRunningAsSafeAppMutation,
  getFavouritesMutation,
  getSubDomainFavouritesMutation,
  setIsAppReady
} from './apollo/mutations/mutations'
import {
  accountsReactive,
  favouritesReactive,
  isAppReadyReactive,
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  subDomainFavouritesReactive
} from './apollo/reactiveVars'
import { setup as setupAnalytics } from './utils/analytics'
import { safeInfo } from './utils/safeApps'
import { getReverseRecord } from './apollo/sideEffects'

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

export const getProvider = async reconnect => {
  let provider
  if (
    process.env.REACT_APP_STAGE === 'local' &&
    process.env.REACT_APP_ENS_ADDRESS
  ) {
    const { providerObject } = await setup({
      reloadOnAccountsChange: true,
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

  //const safe = await safeInfo()
  const safe = false
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

  //provider = await connect()
  const { providerObject } = await setup({
    reloadOnAccountsChange: false,
    enforceReadOnly: true,
    enforceReload: false
  })
  provider = providerObject
  return provider
}

export default async reconnect => {
  try {
    setFavourites()
    setSubDomainFavourites()
    const provider = await getProvider(reconnect)

    if (!provider) throw 'Please install metamask'

    networkIdReactive(await getNetworkId())
    await setWeb3ProviderLocalMutation(provider)
    networkReactive(await getNetwork())

    if (accountsReactive?.[0]) {
      reverseRecordReactive(await getReverseRecord(address))
    }

    isReadOnlyReactive(isReadOnly())

    setupAnalytics()
    const errorHandler = new StackdriverErrorReporter()
    errorHandler.start({
      key: 'AIzaSyDW3loXBr_2e-Q2f8ZXdD0UAvMzaodBBNg',
      projectId: 'idyllic-ethos-235310'
    })

    isAppReadyReactive(true)
  } catch (e) {
    console.error('setup error: ', e)
  }
}

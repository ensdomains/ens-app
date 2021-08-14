import {
  accountsReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  favouritesReactive,
  subDomainFavouritesReactive,
  isAppReadyReactive,
  web3ProviderReactive
} from '../reactiveVars'
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
import { disconnect, connect } from '../../api/web3modal'
import { getReverseRecord } from '../sideEffects'
import { isRunningAsSafeApp } from 'utils/safeApps'
import getENS, { getRegistrar } from './ens'
import {
  GET_ALL_NODES,
  GET_REGISTRANT_FROM_SUBGRAPH
} from '../../graphql/queries'
import getClient from '../apolloClient'
import modeNames from '../../api/modes'
import { emptyAddress, ROPSTEN_DNSREGISTRAR_ADDRESS } from '../../utils/utils'

export const setWeb3ProviderLocalMutation = async provider => {
  web3ProviderReactive(provider)

  const accounts = await getAccounts()

  if (provider) {
    provider.removeAllListeners()
    // setNetworkIdLocalMutation(provider.network.chainId)
    setAccountsLocalMutation(accounts)
  }

  provider?.on('chainChanged', _chainId => {
    console.log('chain changed: ', _chainId)
    setNetworkIdLocalMutation(parseInt(_chainId))
    // getNetworkMutation()
  })

  provider?.on('accountsChanged', accounts => {
    console.log('accounts changed')
    // setAccountsLocalMutation(accounts)
  })

  return provider
}

export const getNetworkMutation = async () => {
  return networkReactive(await getNetwork())
}

export const setAccountsLocalMutation = accounts => {
  return accountsReactive(accounts)
}

export const getIsReadOnlyMutation = () => {}

export const setNetworkIdLocalMutation = networkId => {
  return networkIdReactive(networkId)
}

export const getIsRunningAsSafeAppMutation = async () => {
  return isRunningAsSafeAppReactive(isRunningAsSafeApp())
}

export const connectMutation = async address => {
  let network
  try {
    network = await connect()
  } catch (e) {
    console.error('connect mutation error: ', e)
    //setError({ variables: { message: e?.message } })
  }
  if (network) {
    networkIdReactive(await getNetworkId())
    isReadOnlyReactive(false)
    reverseRecordReactive(await getReverseRecord(address))
  }
}

export const disconnectMutation = async () => {
  networkIdReactive(1)
  networkReactive(null)
  isReadOnlyReactive(true)
  reverseRecordReactive(null)
  await disconnect()
}

export const addFavouriteMutation = domain => {
  const favourites = [...favouritesReactive(), domain]
  window.localStorage.setItem('ensFavourites', JSON.stringify(favourites))
  return favouritesReactive(favourites)
}

export const deleteFavouriteMutation = domain => {
  const previous = favouritesReactive()
  const favourites = previous.filter(
    previousDomain => previousDomain.name !== domain.name
  )
  window.localStorage.setItem('ensFavourites', JSON.stringify(favourites))
  return favouritesReactive(favourites)
}

export const addSubDomainFavouriteMutation = domain => {
  const subDomainFavourites = [...subDomainFavouritesReactive(), domain]
  window.localStorage.setItem(
    'ensSubDomainFavourites',
    JSON.stringify(subDomainFavourites)
  )
  return subDomainFavouritesReactive(subDomainFavourites)
}

export const deleteSubDomainFavouriteMutation = domain => {
  const subDomainFavourites = subDomainFavouritesReactive().filter(
    previousDomain => previousDomain.name !== domain.name
  )
  window.localStorage.setItem(
    'ensSubDomainFavourites',
    JSON.stringify(subDomainFavourites)
  )
  return subDomainFavourites
}

export const setIsAppReady = isAppReady => {
  return
}

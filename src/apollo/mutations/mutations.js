import {
  accountsReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  favouritesReactive,
  subDomainFavouritesReactive,
  web3ProviderReactive,
  delegatesReactive
} from '../reactiveVars'
import getShouldDelegate from '../../api/delegate'
import { getAccounts, getNetwork, getNetworkId } from '@ensdomains/ui'
import { disconnect, connect } from '../../api/web3modal'
import { getReverseRecord } from '../sideEffects'
import { isRunningAsSafeApp } from 'utils/safeApps'

export const setWeb3ProviderLocalMutation = async provider => {
  web3ProviderReactive(provider)

  const accounts = await getAccounts()

  if (provider) {
    if (provider.events?.removeAllListeners)
      provider.events.removeAllListeners()
    setAccountsLocalMutation(accounts)
  }

  provider?.on('chainChanged', _chainId => {
    console.log('chain changed: ', _chainId)
    setNetworkIdLocalMutation(parseInt(_chainId))
  })

  provider?.on('accountsChanged', async accounts => {
    console.log('accounts changed')
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
    delegatesReactive(await getShouldDelegate(address))
  }
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

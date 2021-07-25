import {
  accountsReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  web3Reactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive
} from './reactiveVars'
import {
  getAccounts,
  getNetwork,
  getNetworkId,
  getWeb3,
  isReadOnly
} from '@ensdomains/ui'
import { disconnect, connect } from '../api/web3modal'
import { getReverseRecord } from './sideEffects'
import { isRunningAsSafeApp } from 'utils/safeApps'

export const web3Mutation = async () => {
  return web3Reactive(await getWeb3())
}

export const networkMutation = async () => {
  return networkReactive(await getNetwork())
}

export const reverseRecordMutation = async address => {
  if (address) {
    reverseRecordReactive(await getReverseRecord(address))
  }
}

export const accountsMutation = async () => {
  return accountsReactive(await getAccounts())
}

export const isReadOnlyMutation = () => {
  console.log('isReadOnly: ', isReadOnly)
  isReadOnlyReactive(isReadOnly())
}

export const networkIdMutation = async () => {
  return networkIdReactive(await getNetworkId())
}

export const isRunningAsSafeAppMutation = async () => {
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
    console.log('network: ', network)
    networkIdReactive(await getNetworkId())
    isReadOnlyMutation()
    reverseRecordMutation(address)
  }
}

export const disconnectMutation = async () => {
  reverseRecordReactive(null)
  networkIdReactive(1)
  isReadOnlyReactive(true)
  await disconnect()
}

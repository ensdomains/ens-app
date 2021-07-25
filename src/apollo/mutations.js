import {
  accountsReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  web3Reactive,
  isReadOnlyReactive
} from './reactiveVars'
import {
  getAccounts,
  getNetwork,
  getNetworkId,
  getWeb3,
  isReadOnly
} from '@ensdomains/ui'
import { disconnect } from '../api/web3modal'
import { getReverseRecord } from './sideEffects'

export const connectMutation = async () => {
  let network
  try {
    network = await connect()
  } catch (e) {
    console.error('connect mutation error')
    //setError({ variables: { message: e?.message } })
  }
  if (network) {
    networkIdReactive(await getNetworkId())
  }
}

export const disconnectMutation = async () => {
  await disconnect()
  return networkIdReactive(1)
}

export const web3Mutation = async () => {
  return web3Reactive(await getWeb3())
}

export const networkMutation = async () => {
  return networkReactive(await getNetwork())
}

export const reverseRecordMutation = async address => {
  return reverseRecordReactive(await getReverseRecord(address))
}

export const accountsMutation = async () => {
  return accountsReactive(await getAccounts())
}

export const isReadOnlyMutation = async () => {
  isReadOnlyReactive(await isReadOnly())
}

export const networkIdMutation = async () => {
  return networkIdReactive(await getNetworkId())
}

import { setup } from './api/ens'
import { connect } from './api/web3modal'
import {
  getWeb3,
  getNetworkId,
  getNetwork,
  getAccounts,
  isReadOnly
} from '@ensdomains/ui'
import { setupClient } from './apollo/apolloClient'
import {
  networkIdReactive,
  clientReactive,
  web3Reactive,
  networkReactive,
  reverseRecordReactive,
  accountsReactive
} from './apollo/reactiveVars'
import { getReverseRecord } from './apollo/sideEffects'

const setupWeb3 = async () => {
  web3Reactive(await getWeb3())
}

const setupNetwork = async () => {
  networkReactive(await getNetwork())
}

const setupReverseRecord = async address => {
  const result = await getReverseRecord(address)
  reverseRecordReactive(result)
}

const setupAccounts = async () => {
  const accounts = await getAccounts()
  accountsReactive(accounts)
  return accounts
}

const setupIsReadOnly = async () => {
  isReadOnly(await isReadOnly())
}

export default async () => {
  await setup({
    reloadOnAccountsChange: false,
    enforceReadOnly: true,
    enforceReload: true
  })
  setupIsReadOnly()
  setupWeb3()
  setupNetwork()
  setupReverseRecord()
  const accounts = await setupAccounts()
  setupReverseRecord(accounts?.[0])
  await connect()
  networkIdReactive(await getNetworkId())
}

import { setup } from './api/ens'
import { connect } from './api/web3modal'
import { getWeb3, getNetworkId, getNetwork } from '@ensdomains/ui'
import { setupClient } from './apollo/apolloClient'
import {
  networkIdReactive,
  clientReactive,
  web3Reactive,
  networkReactive,
  reverseRecordReactive
} from './apollo/reactiveVars'
import { getReverseRecord } from './apollo/sideEffects'

const setupWeb3 = async () => {
  web3Reactive(await getWeb3())
}

const setupNetwork = async () => {
  networkReactive(await getNetwork())
}

const setupReverseRecord = async () => {
  const result = await getReverseRecord(
    '0x4e72EAF9C1EDbCcbc1499a565e1803Edfda6512A'
  )
  console.log('result: ', result)
  reverseRecordReactive(result)
}

export default async () => {
  await setup({
    reloadOnAccountsChange: false,
    enforceReadOnly: true,
    enforceReload: true
  })
  setupWeb3()
  setupNetwork()
  setupReverseRecord()
  await connect()
  networkIdReactive(await getNetworkId())
}

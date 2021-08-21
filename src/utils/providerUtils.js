import setup from '../setup'
import {
  accountsReactive,
  isReadOnlyReactive,
  reverseRecordReactive
} from '../apollo/reactiveVars'
import { disconnect } from '../api/web3modal'

export const connectProvider = () => {
  setup(true)
}

export const disconnectProvider = () => {
  disconnect()
  isReadOnlyReactive(true)
  reverseRecordReactive(null)
  accountsReactive(null)
}

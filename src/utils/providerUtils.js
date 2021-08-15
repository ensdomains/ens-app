import setup from '../setup'
import {
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive
} from '../apollo/reactiveVars'
import { disconnect } from '../api/web3modal'

export const connectProvider = () => {
  setup(true)
}

export const disconnectProvider = () => {
  disconnect()
  networkIdReactive(1)
  networkReactive(null)
  isReadOnlyReactive(true)
  reverseRecordReactive(null)
}

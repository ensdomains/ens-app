import {
  networkIdReactive,
  networkReactive,
  clientReactive,
  web3Reactive,
  reverseRecordReactive
} from './reactiveVars'
import { hasValidReverseRecord } from '../utils/utils'

export default {
  Query: {
    fields: {
      networkId: {
        read() {
          return networkIdReactive()
        }
      },
      network: {
        read() {
          const network = networkReactive()
          const networkName = network?.name
          if (!networkName) return 'Loading'
          return networkName === 'homestead' ? 'Main' : networkName
        }
      },
      displayName: {
        read(
          _,
          {
            args: { address }
          }
        ) {
          return hasValidReverseRecord(reverseRecordReactive())
            ? reverseRecordReactive().name
            : `${address?.slice(0, 10)}...`
        }
      }
    }
  }
}

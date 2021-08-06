import {
  networkIdReactive,
  networkReactive,
  clientReactive,
  web3Reactive,
  reverseRecordReactive,
  accountsReactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  detailedNodeReactive,
  isENSReady,
  favouritesReactive,
  globalErrorReactive,
  transactionHistoryReactive
} from './reactiveVars'
import { hasValidReverseRecord } from '../utils/utils'

export default {
  Query: {
    fields: {
      transactionHistory: {
        read() {
          return transactionHistoryReactive()?.transactionHistory
        }
      },
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
      accounts: {
        read() {
          return accountsReactive()
        }
      },
      displayName: {
        read(
          _,
          {
            args: { address }
          }
        ) {
          console.log('displayName')
          const addresss = accountsReactive()?.[0]
          if (!addresss) return ''
          return hasValidReverseRecord(reverseRecordReactive())
            ? reverseRecordReactive().name
            : `${addresss?.slice(0, 10)}...`
        }
      },
      avatar: {
        read() {
          return reverseRecordReactive()?.avatar || ''
        }
      },
      isReadOnly: {
        read() {
          return isReadOnlyReactive()
        }
      },
      isSafeApp: {
        read() {
          return isRunningAsSafeAppReactive()
        }
      },
      singleName: {
        read() {
          return detailedNodeReactive()
        }
      },
      isENSReady: {
        read() {
          return isENSReady()
        }
      },
      favourites: {
        read() {
          return favouritesReactive()
        }
      },
      globalError: {
        read() {
          return globalErrorReactive() || false
        }
      }
    }
  }
}

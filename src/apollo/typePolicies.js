import {
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  accountsReactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  isENSReadyReactive,
  favouritesReactive,
  globalErrorReactive,
  transactionHistoryReactive,
  namesReactive,
  delegatesReactive
} from './reactiveVars'
import { hasValidReverseRecord } from '../utils/utils'

export default {
  Query: {
    fields: {
      names: {
        read() {
          return namesReactive()
        }
      },
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
        read() {
          const addresss = accountsReactive()?.[0]
          if (!addresss) return ''
          return hasValidReverseRecord(reverseRecordReactive())
            ? reverseRecordReactive().name
            : `${addresss.slice(0, 5)}...${addresss.slice(-4)}`
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
      isENSReady: {
        read() {
          return isENSReadyReactive()
        }
      },
      favourites: {
        read() {
          return favouritesReactive()
        }
      },
      shouldDelegate: {
        read() {
          return delegatesReactive()
        }
      },
      globalError: {
        read() {
          return (
            globalErrorReactive() || {
              network: null,
              invalidCharacter: null
            }
          )
        }
      }
    }
  }
}

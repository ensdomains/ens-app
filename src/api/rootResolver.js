import {
  getWeb3,
  getAccounts,
  getNetworkId,
  isReadOnly,
  emptyAddress
} from '@ensdomains/ui'

import getENS from 'api/ens'
import merge from 'lodash/merge'
import { isRunningAsSafeApp } from 'utils/safeApps'
import managerResolvers, {
  defaults as managerDefaults
} from './manager/resolvers'
import auctionRegistrarResolvers, {
  defaults as auctionRegistrarDefaults
} from './registrar/resolvers'
import subDomainRegistrarResolvers, {
  defaults as subDomainRegistrarDefaults
} from './subDomainRegistrar/resolvers'

const rootDefaults = {
  web3: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  },
  error: null,
  loggedIn: null,
  pendingTransactions: [],
  transactionHistory: []
}

const defaults = merge(
  rootDefaults,
  managerDefaults,
  auctionRegistrarDefaults,
  subDomainRegistrarDefaults
)

export default merge(
  // resolvers,
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
)

export { defaults }

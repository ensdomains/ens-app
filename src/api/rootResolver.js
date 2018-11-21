import getWeb3, { getAccounts, getNetworkId } from './web3'
import { getAddr } from './registry'
import merge from 'lodash/merge'
import fifsResolvers, {
  defaults as fifsDefaults
} from './fifsRegistrar/resolvers'
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
  loggedIn: null,
  pendingTransactions: [],
  transactionHistory: []
}

const resolvers = {
  Web3: {
    accounts: () => getAccounts(),
    networkId: async () => {
      const networkId = await getNetworkId()
      return networkId
    },
    network: async () => {
      const networkId = await getNetworkId()

      switch (networkId) {
        case 1:
          return 'main'
        case 2:
          return 'morden'
        case 3:
          return 'ropsten'
        case 4:
          return 'rinkeby'
        case 42:
          return 'kovan'
        default:
          return 'private'
      }
    }
  },
  Query: {
    web3: async (_, variables, context) => {
      try {
        return {
          ...(await getWeb3()),
          __typename: 'Web3'
        }
      } catch (e) {
        console.error(e)
        return null
      }
    },
    publicResolver: async () => {
      try {
        const resolver = await getAddr('resolver.eth')
        return {
          address: resolver,
          __typename: 'Resolver'
        }
      } catch (e) {
        console.log('error getting public resolver', e)
      }
    }
  },

  Mutation: {}
}

const defaults = merge(
  rootDefaults,
  fifsDefaults,
  managerDefaults,
  auctionRegistrarDefaults,
  subDomainRegistrarDefaults
)

export default merge(
  resolvers,
  fifsResolvers,
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
)

export { defaults }

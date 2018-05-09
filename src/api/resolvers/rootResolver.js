import 'isomorphic-fetch'
import getWeb3, { getAccounts } from '../web3'
import { getFifsRegistrarContract } from '../ens'
import { watchRegistryEvent } from '../watchers'
import { getOwner, getRootDomain } from '../registry'
import gql from 'graphql-tag'
import merge from 'lodash/merge'
import fifsResolvers, { defaults as fifsDefaults } from './fifsResolver'
import managerResolvers, {
  defaults as managerDefaults
} from './managerResolver'
import auctionRegistrarResolver, {
  defaults as auctionRegistrarDefaults
} from './auctionRegistrarResolver'

const rootDefaults = {
  web3: {
    accounts: [],
    __typename: 'Web3'
  },
  loggedIn: null,
  pendingTransactions: [],
  transactionHistory: []
}

const resolvers = {
  Web3: {
    accounts: () => getAccounts()
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
    people: async () => {
      const response = await fetch('https://emerald-ink.glitch.me/people')
      const people = await response.json()

      return people.map(person => ({
        ...person,
        __typename: 'thing'
      }))
    }
  },

  Mutation: {}
}

const defaults = merge(
  rootDefaults,
  fifsDefaults,
  managerDefaults,
  auctionRegistrarDefaults
)

export default merge(
  resolvers,
  fifsResolvers,
  managerResolvers,
  auctionRegistrarResolver
)

export { defaults }

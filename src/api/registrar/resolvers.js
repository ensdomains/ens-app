import { createSealedBid, getEntry, getRentPrice, commit } from '../registrar'
import { getOwner } from '../registry'
import modeNames from '../modes'
import { sendHelper } from '../resolverUtils'

const defaults = {}

const resolvers = {
  Query: {
    getRentPrice: async (_, { name, duration }, { cache }) => {
      return {
        price: await getRentPrice(name, duration),
        __typename: 'RentPrice'
      }
    }
  },
  Mutation: {
    async commit(_, { name, owner, secret }, { cache }) {
      const tx = await commit(name, owner, secret)
      return sendHelper(tx)
    },
    async getDomainAvailability(_, { name }, { cache }) {
      try {
        const {
          state,
          registrationDate,
          revealDate,
          value,
          highestBid
        } = await getEntry(name)
        let owner = null

        if (name.length < 7) {
          cache.writeData({
            data: defaults
          })
          return null
        }

        if (modeNames[state] === 'Owned') {
          owner = await getOwner(`${name}.eth`)
        }

        const data = {
          domainState: {
            name: `${name}.eth`,
            state: modeNames[state],
            registrationDate,
            revealDate,
            value,
            highestBid,
            owner,
            __typename: 'DomainState'
          }
        }

        cache.writeData({ data })

        return data.domainState
      } catch (e) {
        console.log('Error in getDomainAvailability', e)
      }
    },
    async startAuctionAndBid(_, { name, bidAmount, decoyBidAmount, secret }) {
      const sealedBid = await createSealedBid(name, bidAmount, secret)
      console.log(sealedBid)
    },
    async bid(_, { name, bidAmount, decoyBidAmount, secret }) {
      // const sealedBid = await createSealedBid(name, bidAmount, secret)
    }
  }
}

export default resolvers

export { defaults }

import {
  createSealedBid,
  getEntry,
  getRentPrice,
  commit,
  getMinimumCommitmentAge
} from '../registrar'
import { getOwner } from '../registry'
import modeNames from '../modes'
import { sendHelper } from '../resolverUtils'

const defaults = {}

const resolvers = {
  Query: {
    async getRentPrice(_, { name, duration }, { cache }) {
      return await getRentPrice(name, duration)
    },
    async getMinimumCommitmentAge() {
      return parseInt(await getMinimumCommitmentAge())
    }
  },
  Mutation: {
    async commit(_, { name }, { cache }) {
      //Generate secret
      const secret =
        '0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
      //Save secret to localStorage with name as the key
      const tx = await commit(name, secret)
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

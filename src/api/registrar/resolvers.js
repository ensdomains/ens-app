import crypto from 'crypto'

import {
  createSealedBid,
  getEntry,
  getRentPrice,
  commit,
  getMinimumCommitmentAge,
  register,
  transferRegistrars
} from '../registrar'
import { getOwner } from '../registry'
import modeNames from '../modes'
import { sendHelper } from '../resolverUtils'

const defaults = {}
const secrets = {}

function randomSecret() {
  return '0x' + crypto.randomBytes(32).toString('hex')
}

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
    async commit(_, { label }, { cache }) {
      //Generate secret
      const secret = randU32Sync()

      secrets[label] = secret
      //Save secret to localStorage with name as the key
      const tx = await commit(label, secret)
      return sendHelper(tx)
    },
    async register(_, { label, duration }) {
      const secret = secrets[label]
      const tx = await register(label, duration, secret)

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
    },
    async transferRegistrars(_, { label }) {
      const tx = await transferRegistrars(label)
      return sendHelper(tx)
    }
  }
}

export default resolvers

export { defaults }

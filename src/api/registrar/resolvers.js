import crypto from 'crypto'

import {
  getEntry,
  getRentPrice,
  commit,
  getMinimumCommitmentAge,
  register,
  renew,
  transferRegistrars,
  releaseDeed,
  submitProof,
  transferOwner,
  reclaim
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
      const secret = randomSecret()

      secrets[label] = secret
      //TODO: Save secret to localStorage with name as the key
      const tx = await commit(label, secret)
      return sendHelper(tx)
    },
    async register(_, { label, duration }) {
      const secret = secrets[label]
      const tx = await register(label, duration, secret)

      return sendHelper(tx)
    },
    async reclaim(_, { name, address }) {
      const tx = await reclaim({ name, address })
      return sendHelper(tx)
    },
    async renew(_, { label, duration }) {
      const tx = await renew(label, duration)
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
    async setRegistrant(_, { name, address }) {
      const tx = await transferOwner({ name, to: address })
      return sendHelper(tx)
    },
    async transferRegistrars(_, { label }) {
      const tx = await transferRegistrars(label)
      return sendHelper(tx)
    },
    async releaseDeed(_, { label }) {
      const tx = await releaseDeed(label)
      return sendHelper(tx)
    },
    async submitProof(_) {
      const tx = await submitProof()
      return sendHelper(tx)
    }
  }
}

export default resolvers

export { defaults }

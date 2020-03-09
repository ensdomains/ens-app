import crypto from 'crypto'
import { isShortName } from '../../utils/utils'

import getENS, { getRegistrar } from 'api/ens'

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
      const registrar = getRegistrar()
      return registrar.getRentPrice(name, duration)
    },
    async getMinimumCommitmentAge() {
      try {
        const registrar = getRegistrar()
        console.log(registrar)
        const minCommitmentAge = await registrar.getMinimumCommitmentAge()
        return parseInt(minCommitmentAge)
      } catch (e) {
        console.log(e)
      }
    }
  },
  Mutation: {
    async commit(_, { label }, { cache }) {
      const registrar = getRegistrar()
      //Generate secret
      const secret = randomSecret()
      secrets[label] = secret
      const tx = await registrar.commit(label, secret)
      return sendHelper(tx)
    },
    async register(_, { label, duration }) {
      const registrar = getRegistrar()
      const secret = secrets[label]
      const tx = await registrar.register(label, duration, secret)

      return sendHelper(tx)
    },
    async reclaim(_, { name, address }) {
      const registrar = getRegistrar()
      const tx = await registrar.reclaim(name, address)
      return sendHelper(tx)
    },
    async renew(_, { label, duration }) {
      const registrar = getRegistrar()
      const tx = await registrar.renew(label, duration)
      return sendHelper(tx)
    },
    async getDomainAvailability(_, { name }, { cache }) {
      const registrar = getRegistrar()
      const ens = getENS()
      try {
        const {
          state,
          registrationDate,
          revealDate,
          value,
          highestBid
        } = await registrar.getEntry(name)
        let owner = null
        if (isShortName(name)) {
          cache.writeData({
            data: defaults
          })
          return null
        }

        if (modeNames[state] === 'Owned') {
          owner = await ens.getOwner(`${name}.eth`)
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
      const registrar = getRegistrar()
      const tx = await registrar.transferOwner(name, address)
      return sendHelper(tx)
    },
    async releaseDeed(_, { label }) {
      const registrar = getRegistrar()
      const tx = await registrar.releaseDeed(label)
      return sendHelper(tx)
    },
    async submitProof(_, { name, parentOwner }) {
      const registrar = getRegistrar()
      const tx = await registrar.submitProof(name, parentOwner)
      return sendHelper(tx)
    }
  }
}

export default resolvers

export { defaults }

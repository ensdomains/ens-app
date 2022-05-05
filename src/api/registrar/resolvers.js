import { isShortName } from '../../utils/utils'

import getENS, { getRegistrar } from 'apollo/mutations/ens'

import modeNames from '../modes'
import { sendHelper } from '../resolverUtils'

const defaults = {}

const resolvers = {
  Query: {
    async getPriceCurve(_, {}) {
      const registrar = getRegistrar()
      return registrar.getPriceCurve()
    },
    async getEthPrice(_, {}) {
      const registrar = getRegistrar()
      return registrar.getEthPrice()
    },
    async getRentPrice(_, { label, duration }) {
      const registrar = getRegistrar()
      return registrar.getRentPrice(label, duration)
    },
    async getRentPriceAndPremium(_, { label, duration, block }) {
      const registrar = getRegistrar()
      return registrar.getRentPriceAndPremium(label, duration, block)
    },
    async getRentPrices(_, { labels, duration }) {
      const registrar = getRegistrar()
      return labels.length && registrar.getRentPrices(labels, duration)
    },
    async getPremium(_, { name, expires, duration }) {
      const registrar = getRegistrar()
      return registrar.getPremium(name, expires, duration)
    },
    async getTimeUntilPremium(_, { expires, amount }) {
      const registrar = getRegistrar()
      return registrar.getTimeUntilPremium(expires, amount)
    },

    async getMinimumCommitmentAge() {
      try {
        const registrar = getRegistrar()
        const minCommitmentAge = await registrar.getMinimumCommitmentAge()
        return parseInt(minCommitmentAge)
      } catch (e) {
        console.log(e)
      }
    },
    async getMaximumCommitmentAge() {
      try {
        const registrar = getRegistrar()
        const maximumCommitmentAge = await registrar.getMaximumCommitmentAge()
        return parseInt(maximumCommitmentAge)
      } catch (e) {
        console.log(e)
      }
    },
    async checkCommitment(_, { label, secret }) {
      try {
        const registrar = getRegistrar()
        const commitment = await registrar.checkCommitment(label, secret)
        return parseInt(commitment)
      } catch (e) {
        console.log(e)
      }
    }
  },
  Mutation: {
    async commit(_, { label, secret }) {
      const registrar = getRegistrar()
      const tx = await registrar.commit(label, secret)
      return sendHelper(tx)
    },
    async register(_, { label, duration, secret }) {
      const registrar = getRegistrar()
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
    async getDomainAvailability(_, { name }) {
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
    async submitProof(_, { name, parentOwner }) {
      const registrar = getRegistrar()
      const tx = await registrar.submitProof(name, parentOwner)
      return sendHelper(tx)
    },
    async renewDomains(_, { labels, duration }) {
      const registrar = getRegistrar()
      const tx = await registrar.renewAll(labels, duration)
      return sendHelper(tx)
    }
  }
}

export default resolvers

export { defaults }

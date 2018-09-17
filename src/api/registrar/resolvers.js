import { createSealedBid, getEntry } from '../registrar'
import { getOwner } from '../registry'
import modeNames from '../modes'

const defaults = {}

const resolvers = {
  Mutation: {
    async getDomainAvailability(_, { name }, { cache }) {
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

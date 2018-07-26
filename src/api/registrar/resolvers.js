import { getMode, createSealedBid } from '../registrar'
import { getOwner } from '../registry'

const defaults = {
  domainState: null
}

const modeNames = [
  'Open',
  'Auction',
  'Owned',
  'Forbidden',
  'Reveal',
  'NotYetAvailable'
]

const resolvers = {
  Mutation: {
    async getDomainAvailability(_, { name }, { cache }) {
      const state = await getMode(name)
      let owner = null

      console.log(name)

      if (modeNames[state] === 'Owned') {
        console.log(1)
        owner = await getOwner(`${name}.eth`)
      }

      const data = {
        domainState: {
          name: `${name}.eth`,
          state: modeNames[state],
          owner,
          __typename: 'DomainState'
        }
      }

      cache.writeData({ data })

      return data
    },
    async startAuctionAndBid(_, { name, bidAmount, decoyBidAmount, secret }) {
      const sealedBid = await createSealedBid(name, bidAmount, secret)
      console.log(sealedBid)
    },
    async bid(_, { name, bidAmount, decoyBidAmount, secret }) {
      const sealedBid = await createSealedBid(name, bidAmount, secret)
    }
  }
}

export default resolvers

export { defaults }

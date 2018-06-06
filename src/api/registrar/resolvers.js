import { getMode, createSealedBid } from '../registrar'

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

      const data = {
        domainState: {
          name,
          state: modeNames[state],
          __typename: 'DomainState'
        }
      }

      cache.writeData({ data })

      return data
    },
    async startAuctionAndBid(_, { name, bidAmount, decoyBidAmount, secret }) {
      console.log('here')
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

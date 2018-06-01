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
    async getDomainState(_, { name }, { cache }) {
      const state = await getMode(name)

      const data = {
        domainState: {
          name,
          state: modeNames[state],
          __typename: 'NodeState'
        }
      }

      cache.writeData({ data })

      return data
    },
    async bid(_, { name, bidAmount, decoyBidAmount, secret }) {
      console.log(name, bidAmount, decoyBidAmount, secret)
      const sealedBid = await createSealedBid(name, bidAmount, secret)
      console.log(sealedBid)
    }
  }
}

export default resolvers

export { defaults }

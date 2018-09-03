import { getMode, createSealedBid, getEntry } from '../registrar'
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
      const {
        state,
        registrationDate,
        revealDate,
        value,
        highestBid
      } = await getEntry(name)
      let owner = null

      cache.writeData({
        data: {
          domainState: null
        }
      })

      console.log(name)

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

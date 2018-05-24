import { getMode } from '../registrar'

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
    getDomainState: async (_, { name }, { cache }) => {
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
    }
    // getDomainState: async (_, { name }, { cache }) => {
    //   const state = await getMode(name)

    //   return {
    //     name,
    //     state: modeNames[state],
    //     __typename: 'NodeState'
    //   }
    // }
  }
}

export default resolvers

export { defaults }

import { queryAll } from '../subDomainRegistrar'

const defaults = {
  domainState: null
}

const getAllNodes = cache => {
  const query = gql`
    query nodes {
      nodes {
        name
        domain
        price
        rent
        referralFeePPM
      }
    }
  `

  return cache.readQuery({ query })
}

const resolvers = {
  Mutation: {
    async getSubDomainAvailability(_, { name }, { cache }) {
      const nodes = await queryAll(name)

      const currentNodes = getAllNodes(cache)

      nodes.map(node => {
        const node = {
          name,
          domain: node[0],
          price: node[1],
          rent: node[2],
          referralFeePPM: node[3],
          __typename: 'SubDomainState'
        }

        const data = {
          subDomainState: [...currentNodes, node]
        }

        cache.writeData({ data })
      })
      // const data = {
      //   subDomains: {
      //     name,
      //     state: modeNames[state],
      //     __typename: 'NodeState'
      //   }
      // }

      // cache.writeData({ data })

      return data
    }
  }
}

export default resolvers

export { defaults }

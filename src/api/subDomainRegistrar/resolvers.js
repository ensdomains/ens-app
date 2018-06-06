import { queryAll } from '../subDomainRegistrar'
import gql from 'graphql-tag'

const defaults = {
  subDomainState: []
}

const getAllNodes = cache => {
  const query = gql`
    query subDomainState {
      subDomainState {
        label
        domain
        price
        rent
        referralFeePPM
        available
      }
    }
  `

  return cache.readQuery({ query })
}

const resolvers = {
  Mutation: {
    async getSubDomainAvailability(_, { name }, { cache }) {
      const nodes = await queryAll(name)
      const cachedNodes = []

      nodes.map(subDomainPromise =>
        subDomainPromise.then(node => {
          const newNode = {
            ...node,
            __typename: 'SubDomainState'
          }

          cachedNodes.push(newNode)

          const data = {
            subDomainState: [...cachedNodes]
          }

          cache.writeData({ data })
        })
      )

      return Promise.all(nodes).then(() => ({
        subDomainState: cachedNodes
      }))
    }
  }
}

export default resolvers

export { defaults }

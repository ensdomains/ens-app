import { watchRegistryEvent } from '../watchers'
import { getOwner, getRootDomain, getSubdomains } from '../registry'
import gql from 'graphql-tag'

const defaults = {
  nodes: []
}

const resolvers = {
  Mutation: {
    addNode: async (_, { name }, { cache }) => {
      const owner = await getOwner(name)

      //Return null if no owner
      if (parseInt(owner, 16) === 0) {
        return null
      }

      //Get all nodes
      const query = gql`
        query nodes {
          nodes {
            name
            owner
            label
            resolver
            addr
            content
            nodes
          }
        }
      `

      const { nodes } = cache.readQuery({ query })

      //Create Node
      let node = {
        name,
        owner,
        __typename: 'Node'
      }

      //Write to cache

      const rootNode = await getRootDomain(name).then(rootDomainRaw => {
        //console.log(rootDomainRaw)
        const newNode = { ...node, ...rootDomainRaw }
        const data = {
          nodes: [...nodes, newNode]
        }

        cache.writeData({ data })
        return newNode
      })

      console.log('ROOT NODE', rootNode)

      return rootNode
    },
    getSubdomains: async (_, { name, owner }, { cache }) => {
      if (!owner) {
        owner = await getOwner(name)
      }

      if (parseInt(owner, 16) === 0) {
        return null
      }

      const subdomains = await getSubdomains(name)

      console.log(subdomains)

      return subdomains
    }
  }
}

export default resolvers

export { defaults }

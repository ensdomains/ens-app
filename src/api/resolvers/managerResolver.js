import 'isomorphic-fetch'
import getWeb3, { getAccounts } from '../web3'
import { watchRegistryEvent } from '../watchers'
import { getOwner, getRootDomain } from '../registry'
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
    }
  }
}

export default resolvers

export { defaults }

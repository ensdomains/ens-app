import { watchRegistryEvent } from '../watchers'
import { getOwner, getRootDomain, getSubdomains } from '../registry'
import gql from 'graphql-tag'
import get from 'lodash/get'
import set from 'lodash/set'

const defaults = {
  nodes: []
}

const getAllNodes = cache => {
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

  return cache.readQuery({ query })
}

export function resolveQueryPath(domainArray, path, db) {
  if (domainArray.length === 0) {
    return path
  }

  let domainArrayPopped = domainArray.slice(0, domainArray.length - 1)
  let currentLabel = domainArray[domainArray.length - 1]

  function findIndex(path, db, label) {
    const nodes = get(db, path)
    const index = nodes.findIndex(node => {
      return node.label === label
    })
    return index
  }

  let updatedPath
  if (typeof path[path.length - 1] === 'string') {
    let index = findIndex(path, db, currentLabel)
    updatedPath = [...path, index, 'nodes']
  } else {
    updatedPath = [...path, 'nodes']
    let index = findIndex(updatedPath, db, currentLabel)
    updatedPath = [...updatedPath, index]
  }

  return resolveQueryPath(domainArrayPopped, updatedPath, db)
}

const resolvers = {
  Query: {
    singleNode: async (_, { name }, { cache }) => {
      console.log('getSingleNode', name)
      const owner = await getOwner(name)
      console.log(owner)
      return {
        name,
        owner,
        __typename: 'Node'
      }
    }
  },
  Mutation: {
    addNode: async (_, { name }, { cache }) => {
      const owner = await getOwner(name)

      //Return null if no owner
      if (parseInt(owner, 16) === 0) {
        return null
      }
      //Get all nodes
      const { nodes } = getAllNodes(cache)
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

      const data = getAllNodes(cache)

      const rawNodes = await getSubdomains(name)
      const nodes = rawNodes.map(node => {
        if (parseInt(node.resolver, 16) === 0 || node.decrypted === false) {
          return {
            ...node,
            __typename: 'Node',
            addr: null,
            content: null
          }
        }
        return {
          ...node,
          __typename: 'Node'
        }
      })

      console.log(nodes)
      const domainArray = name.split('.')

      //Remove global tld
      let domainArraySliced = domainArray.slice(0, domainArray.length - 1)

      const path = resolveQueryPath(domainArraySliced, ['nodes'], data)
      const newData = set({ ...data }, path, nodes)
      cache.writeData({
        data: newData
      })
      return nodes
    }
  }
}

export default resolvers

export { defaults }

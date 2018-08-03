import { watchRegistryEvent } from '../watchers'
import { getOwner, getDomainDetails, getSubDomains, getName } from '../registry'
import gql from 'graphql-tag'
import get from 'lodash/get'
import set from 'lodash/set'

const defaults = {
  names: []
}

const getAllNodes = cache => {
  const query = gql`
    query names {
      names {
        name
        owner
        label
        resolver
        addr
        content
        subDomains
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
    singleName: async (_, { name }, { cache }) => {
      const { names } = getAllNodes(cache)
      const owner = await getOwner(name)
      let domainRaw

      //Create Node
      let node = {
        name,
        owner,
        __typename: 'Node'
      }

      domainRaw = await getDomainDetails(name)

      console.log(domainRaw)

      const newNode = {
        ...node,
        ...domainRaw
      }

      const data = {
        names: [...names, newNode]
      }

      console.log(newNode)

      cache.writeData({ data })

      return newNode
    },
    getSubDomains: async (_, { name, owner }, { cache }) => {
      if (!owner) {
        owner = await getOwner(name)
      }

      if (parseInt(owner, 16) === 0) {
        return null
      }

      const data = getAllNodes(cache)
      const subDomains = await getSubDomains(name)

      const names = data.names.map(node => {
        return node.name === name
          ? {
              ...node,
              subDomains
            }
          : node
      })

      const newData = {
        ...data,
        names
      }

      cache.writeData({
        data: newData
      })

      return {
        subDomains,
        __typename: 'SubDomains'
      }
    },
    getReverseRecord: async (_, { address }, { cache }) => {
      const obj = {
        address,
        __typename: 'ReverseRecord'
      }

      try {
        const { name } = await getName(address)
        return {
          ...obj,
          name
        }
      } catch (e) {
        return {
          ...obj,
          name: null
        }
      }
    }
  },
  Mutation: {
    // addNode: async (_, { name }, { cache }) => {
    //   const owner = await getOwner(name)
    //   //Return null if no owner
    //   if (parseInt(owner, 16) === 0) {
    //     return null
    //   }
    //   //Get all nodes
    //   const { nodes } = getAllNodes(cache)
    //   //Create Node
    //   let node = {
    //     name,
    //     owner,
    //     __typename: 'Node'
    //   }
    //   //Write to cache
    //   const rootNode = await getDomainDetails(name).then(rootDomainRaw => {
    //     //console.log(rootDomainRaw)
    //     const newNode = { ...node, ...rootDomainRaw }
    //     const data = {
    //       nodes: [...nodes, newNode]
    //     }
    //     cache.writeData({ data })
    //     return newNode
    //   })
    //   console.log('ROOT NODE', rootNode)
    //   return rootNode
    // },
    //   getSubDomains: async (_, { name, owner }, { cache }) => {
    //     if (!owner) {
    //       owner = await getOwner(name)
    //     }
    //     if (parseInt(owner, 16) === 0) {
    //       return null
    //     }
    //     const data = getAllNodes(cache)
    //     const rawNodes = await getSubDomains(name)
    //     const nodes = rawNodes.map(node => {
    //       if (parseInt(node.resolver, 16) === 0 || node.decrypted === false) {
    //         return {
    //           ...node,
    //           __typename: 'Node',
    //           addr: null,
    //           content: null
    //         }
    //       }
    //       return {
    //         ...node,
    //         __typename: 'Node'
    //       }
    //     })
    //     console.log(nodes)
    //     const domainArray = name.split('.')
    //     //Remove global tld
    //     let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
    //     const path = resolveQueryPath(domainArraySliced, ['nodes'], data)
    //     const newData = set({ ...data }, path, nodes)
    //     cache.writeData({
    //       data: newData
    //     })
    //     return nodes
    //   }
  }
}

export default resolvers

export { defaults }

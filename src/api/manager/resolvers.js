import { watchRegistryEvent } from '../watchers'
import { getOwner, getDomainDetails, getSubDomains, getName } from '../registry'
import get from 'lodash/get'

import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_ALL_NODES
} from '../../graphql/queries'

const defaults = {
  names: [],
  favourites: [],
  subDomainFavourites: []
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
      const { names } = cache.readQuery({ query: GET_ALL_NODES })
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

      const data = cache.readQuery({ query: GET_ALL_NODES })
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
    addFavourite: async (_, { domain }, { cache }) => {
      const newFavourite = {
        ...domain,
        __typename: 'Domain'
      }

      const previous = cache.readQuery({ query: GET_FAVOURITES })

      const data = {
        favourites: [...previous.favourites, newFavourite]
      }

      cache.writeData({ data })

      return data
    },
    deleteFavourite: async (_, { domain }, { cache }) => {
      const previous = cache.readQuery({ query: GET_FAVOURITES })

      const data = {
        favourites: previous.favourites.filter(
          previousDomain => previousDomain.name !== domain.name
        )
      }

      cache.writeData({ data })

      return data
    },
    addSubDomainFavourite: async (_, { domain }, { cache }) => {
      const previous = cache.readQuery({ query: GET_SUBDOMAIN_FAVOURITES })

      const newFavourite = {
        ...domain,
        __typename: 'SubDomain'
      }

      const data = {
        subDomainFavourites: [...previous.subDomainFavourites, newFavourite]
      }

      cache.writeData({ data })

      console.log('here')

      return data
    },
    deleteSubDomainFavourite: async (_, { domain }, { cache }) => {
      console.log('HERE in delete')
      const previous = cache.readQuery({ query: GET_SUBDOMAIN_FAVOURITES })

      const data = {
        subDomainFavourites: previous.subDomainFavourites.filter(
          previousDomain => previousDomain.name !== domain.name
        )
      }
      cache.writeData({ data })
      return data
    }
  }
}

export default resolvers

export { defaults }

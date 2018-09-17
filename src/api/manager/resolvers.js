import { getOwner, getDomainDetails, getSubDomains, getName } from '../registry'
import { getEntry } from '../registrar'
import modeNames from '../modes'
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

function getParent(name) {
  const nameArray = name.split('.')
  nameArray.shift()
  return nameArray.join('.')
}

const resolvers = {
  Query: {
    singleName: async (_, { name }, { cache }) => {
      const nameArray = name.split('.')
      let node = {
        revealDate: null,
        registrationDate: null,
        value: null,
        highestBid: null,
        state: null
      }
      let data
      //const owner = await getOwner(name)

      if (nameArray.length < 3 && nameArray[1] === 'eth') {
        if (nameArray[0].length < 7) {
          cache.writeData({
            data: defaults
          })
          return null
        }

        const {
          state,
          registrationDate,
          revealDate,
          value,
          highestBid
        } = await getEntry(nameArray[0])

        const owner = await getOwner(name)
        node = {
          name: `${name}`,
          state: modeNames[state],
          registrationDate,
          revealDate,
          value,
          highestBid,
          owner,
          __typename: 'Node'
        }
      }

      const { names } = cache.readQuery({ query: GET_ALL_NODES })
      const nodeDetails = await getDomainDetails(name)

      const detailedNode = {
        ...node,
        ...nodeDetails,
        parent: nameArray.length > 1 ? getParent(name) : null,
        __typename: 'Node'
      }

      data = {
        names: [...names, detailedNode]
      }

      cache.writeData({ data })

      return detailedNode
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

      console.log('SubDomain', newFavourite)

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

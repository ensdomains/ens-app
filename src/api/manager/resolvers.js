import { getOwner, getDomainDetails, getSubDomains, getName } from '../registry'
import { getEntry } from '../registrar'
import { query } from '../subDomainRegistrar'
import modeNames from '../modes'
import get from 'lodash/get'
import getWeb3 from '../web3'

import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_ALL_NODES
} from '../../graphql/queries'

let savedFavourites =
  JSON.parse(window.localStorage.getItem('ensFavourites')) || []
let savedSubDomainFavourites =
  JSON.parse(window.localStorage.getItem('ensSubDomainFavourites')) || []

const defaults = {
  names: [],
  favourites: savedFavourites,
  subDomainFavourites: savedSubDomainFavourites
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
      const { networkId } = await getWeb3()
      let node = {
        name: null,
        revealDate: null,
        registrationDate: null,
        value: null,
        highestBid: null,
        state: null,
        label: null,
        domain: null,
        price: null,
        rent: null,
        referralFeePPM: null,
        available: null
      }
      let data
      //const owner = await getOwner(name)
      console.log(nameArray)

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
          ...node,
          name: `${name}`,
          state: modeNames[state],
          registrationDate,
          revealDate,
          value,
          highestBid,
          owner,
          __typename: 'Node'
        }
      } else {
        if (networkId === 1) {
          const subdomain = await query(
            nameArray.slice(1).join('.'),
            nameArray[0]
          )

          node = {
            name: `${name}`,
            ...node,
            ...subdomain,
            state: subdomain.available ? 'Open' : 'Owned'
          }
        }
      }

      const { names } = cache.readQuery({ query: GET_ALL_NODES })
      console.log('here in node details')
      const nodeDetails = await getDomainDetails(name)

      console.log(nodeDetails)

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
      window.localStorage.setItem(
        'ensFavourites',
        JSON.stringify(data.favourites)
      )

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
      window.localStorage.setItem(
        'ensFavourites',
        JSON.stringify(data.favourites)
      )

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
      window.localStorage.setItem(
        'ensSubDomainFavourites',
        JSON.stringify(data.subDomainFavourites)
      )

      return data
    },
    deleteSubDomainFavourite: async (_, { domain }, { cache }) => {
      const previous = cache.readQuery({ query: GET_SUBDOMAIN_FAVOURITES })

      const data = {
        subDomainFavourites: previous.subDomainFavourites.filter(
          previousDomain => previousDomain.name !== domain.name
        )
      }

      cache.writeData({ data })
      window.localStorage.setItem(
        'ensSubDomainFavourites',
        JSON.stringify(data.subDomainFavourites)
      )

      return data
    }
  }
}

export default resolvers

export { defaults }

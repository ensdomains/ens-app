import {
  getOwner,
  getEntry,
  getDNSEntry,
  isDNSRegistrar,
  setSubnodeOwner,
  getDomainDetails,
  getSubdomains,
  getName,
  getNetworkId,
  getAddress,
  claimAndSetReverseRecordName,
  setOwner,
  setResolver,
  setAddress,
  setContent,
  setContenthash,
  registerTestdomain,
  createSubdomain,
  expiryTimes,
  isDecrypted
} from '@ensdomains/ui'
import { query } from '../subDomainRegistrar'
import modeNames from '../modes'
import domains from '../../constants/domains.json'
import { sendHelper } from '../resolverUtils'
import { emptyAddress } from '../../utils/utils'
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
  subDomainFavourites: savedSubDomainFavourites,
  transactionHistory: []
}

async function getParent(name) {
  const nameArray = name.split('.')
  if (nameArray.length < 1) {
    return [null, null]
  }
  nameArray.shift()
  const parent = nameArray.join('.')
  const parentOwner = await getOwner(parent)
  return [parent, parentOwner]
}

const resolvers = {
  Query: {
    singleName: async (_, { name }, { cache }) => {
      try {
        const nameArray = name.split('.')
        const decrypted = isDecrypted(name)
        const networkId = await getNetworkId()
        let node = {
          name: null,
          revealDate: null,
          registrationDate: null,
          migrationStartDate: null,
          currentBlockDate: null,
          transferEndDate: null,
          gracePeriodEndDate: null,
          value: null,
          highestBid: null,
          state: null,
          label: null,
          decrypted,
          domain: null,
          price: null,
          rent: null,
          referralFeePPM: null,
          available: null,
          contentType: null,
          expiryTime: null,
          isNewRegistrar: null,
          isDNSRegistrar: null,
          dnsOwner: null,
          deedOwner: null,
          registrant: null
        }
        let data
        if (nameArray.length < 3 && nameArray[1] === 'eth') {
          const entry = await getEntry(nameArray[0])
          const {
            registrant,
            deedOwner,
            state,
            registrationDate,
            migrationStartDate,
            currentBlockDate,
            transferEndDate,
            gracePeriodEndDate,
            revealDate,
            value,
            highestBid,
            expiryTime,
            isNewRegistrar,
            available
          } = entry
          const owner = await getOwner(name)
          node = {
            ...node,
            name: `${name}`,
            state: modeNames[state],
            registrationDate,
            gracePeriodEndDate: gracePeriodEndDate || null,
            migrationStartDate: migrationStartDate || null,
            currentBlockDate: currentBlockDate || null,
            transferEndDate: transferEndDate || null,
            revealDate,
            value,
            highestBid,
            owner,
            registrant,
            deedOwner,
            isNewRegistrar: !!isNewRegistrar,
            available,
            expiryTime: expiryTime || null,
            __typename: 'Node'
          }
        } else if (nameArray.length < 3 && nameArray[1] === 'test') {
          const expiryTime = await expiryTimes(nameArray[0])
          if (expiryTime) {
            node.expiryTime = expiryTime
          }
        } else if (nameArray.length > 2) {
          if (networkId === 1) {
            const domain =
              domains.find(domain => domain.name === nameArray[1]) || {}
            const subdomain = await query(
              nameArray[1],
              nameArray[0],
              domain.registrar
            )
            node = {
              name: `${name}`,
              ...node,
              ...subdomain,
              state: subdomain.available ? 'Open' : 'Owned'
            }
          }
        } else {
          // either dnssect domain or non existing domain
          let tld = nameArray[1]
          let owner
          let tldowner = (await getOwner(tld)).toLocaleLowerCase()
          try {
            owner = (await getOwner(name)).toLocaleLowerCase()
          } catch {}

          let isDNSRegistrarSupported = await isDNSRegistrar(tld)
          if (isDNSRegistrarSupported && tldowner !== emptyAddress) {
            const dnsEntry = await getDNSEntry(name, tldowner, owner)
            node.isDNSRegistrar = true
            node.dnsOwner = dnsEntry.dnsOwner || emptyAddress
            node.state = dnsEntry.state
          }
        }

        console.log(node)

        const { names } = cache.readQuery({ query: GET_ALL_NODES })
        const nodeDetails = await getDomainDetails(name)
        const [parent, parentOwner] = await getParent(name)
        var detailedNode = {
          ...node,
          ...nodeDetails,
          parent,
          parentOwner,
          __typename: 'Node'
        }

        data = {
          names: [...names, detailedNode]
        }

        cache.writeData({ data })

        return detailedNode
      } catch (e) {
        console.log('Error in Single Name', e)
      }
    },
    getSubDomains: async (_, { name, owner }, { cache }) => {
      if (!owner) {
        owner = await getOwner(name)
      }

      if (parseInt(owner, 16) === 0) {
        return null
      }

      const data = cache.readQuery({ query: GET_ALL_NODES })
      const rawSubDomains = await getSubdomains(name)
      const subDomains = rawSubDomains.map(s => ({
        ...s,
        __typename: 'SubDomain'
      }))

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
        if (name !== null) {
          const addr = await getAddress(name)
          return {
            ...obj,
            name,
            addr,
            match: false
          }
        } else {
          return {
            ...obj,
            name: null,
            match: false
          }
        }
      } catch (e) {
        console.log(e)
        return {
          ...obj,
          name: null,
          match: false
        }
      }
    }
  },
  Mutation: {
    registerTestdomain: async (_, { label }) => {
      const tx = await registerTestdomain(label)
      return sendHelper(tx)
    },
    setName: async (_, { name }) => {
      try {
        const tx = await claimAndSetReverseRecordName(name)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setOwner: async (_, { name, address }, { cache }) => {
      try {
        const tx = await setOwner(name, address)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setSubnodeOwner: async (_, { name, address }, { cache }) => {
      try {
        const tx = await setSubnodeOwner(name, address)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setResolver: async (_, { name, address }, { cache }) => {
      try {
        const tx = await setResolver(name, address)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setAddress: async (_, { name, recordValue }, { cache }) => {
      try {
        const tx = await setAddress(name, recordValue)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setContent: async (_, { name, recordValue }, { cache }) => {
      try {
        const tx = await setContent(name, recordValue)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setContenthash: async (_, { name, recordValue }, { cache }) => {
      try {
        const tx = await setContenthash(name, recordValue)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    createSubdomain: async (_, { name }, { cache }) => {
      try {
        const tx = await createSubdomain(name)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
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

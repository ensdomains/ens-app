import {
  getOwner,
  getDomainDetails,
  getSubDomains,
  getName,
  getAddr,
  claimAndSetReverseRecordName,
  setOwner,
  setResolver,
  setAddress,
  setContent,
  setContenthash,
  createSubdomain
} from '../registry'
import { getEntry } from '../registrar'
import { query } from '../subDomainRegistrar'
import modeNames from '../modes'
import { getNetworkId } from '../web3'
import domains from '../../constants/domains.json'
import { client } from '../../index'

import {
  GET_TRANSACTION_HISTORY,
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

function getParent(name) {
  const nameArray = name.split('.')
  nameArray.shift()
  return nameArray.join('.')
}

async function addTransaction({ txHash, txState }) {
  const newTransaction = {
    txHash,
    txState,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    __typename: 'Transaction'
  }
  
  const previous = client.readQuery({ query: GET_TRANSACTION_HISTORY })
  const index = previous.transactionHistory.findIndex(trx => trx.txHash === txHash)
  const newTransactionHistory = [...previous.transactionHistory]
  if(index >= 0 ){
    newTransactionHistory[index] = { ...newTransactionHistory[index], txState, updatedAt: newTransaction.updatedAt}
  }else{
    newTransactionHistory.push(newTransaction)
  }

  const data = {
    transactionHistory: newTransactionHistory
  }
  client.writeQuery({ query: GET_TRANSACTION_HISTORY, data })
  return data
}

function sendHelper(tx) {
  return new Promise((resolve, reject) => {
    tx()
      .on('transactionHash', txHash => {
        const txState = 'Pending'
        addTransaction({ txHash, txState })
        resolve(txHash)
      })
      .on('receipt', receipt => {
        const txHash = receipt.transactionHash
        const txState = 'Confirmed'
        addTransaction({ txHash, txState })
      })
  })
}

const resolvers = {
  Query: {
    singleName: async (_, { name }, { cache }) => {
      try {
        const nameArray = name.split('.')
        const networkId = await getNetworkId()
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
          available: null,
          contentType: null
        }
        let data
        if (nameArray.length < 3 && nameArray[1] === 'eth') {
          if (nameArray[0].length < 7) {
            cache.writeData({
              data: defaults
            })
            return null
          }

          const entry = await getEntry(nameArray[0])
          const {
            state,
            registrationDate,
            revealDate,
            value,
            highestBid
          } = entry

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
        }

        const { names } = cache.readQuery({ query: GET_ALL_NODES })
        const nodeDetails = await getDomainDetails(name)

        var detailedNode = {
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
      const rawSubDomains = await getSubDomains(name)
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
          const addr = await getAddr(name)
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
    setName: async (_, { name }) => {
      try {
        console.log(name)
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
    setResolver: async (_, { name, address }, { cache }) => {
      try {
        const tx = await setResolver(name, address)
        console.log(tx)
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
        const  tx = await setContent(name, recordValue)
        console.log(tx)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    setContenthash: async (_, { name, recordValue }, { cache }) => {
      try {
        const tx = await setContenthash(name, recordValue)
        console.log(tx)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    createSubdomain: async (_, { name, label }, { cache }) => {
      try {
        const tx = await createSubdomain(label, name)
        console.log(tx)
        return sendHelper(tx)
      } catch (e) {
        console.log(e)
      }
    },
    addTransaction: async (_, { txHash, txState }) => {
      return addTransaction({ txHash, txState })
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

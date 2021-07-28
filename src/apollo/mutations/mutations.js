import {
  accountsReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  web3Reactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  detailedNodeReactive,
  isENSReady,
  favouritesReactive,
  subDomainFavouritesReactive
} from '../reactiveVars'
import {
  getAccounts,
  getNetwork,
  getNetworkId,
  getWeb3,
  isDecrypted,
  isReadOnly,
  labelhash,
  utils
} from '@ensdomains/ui'
import { disconnect, connect } from '../../api/web3modal'
import { getReverseRecord } from '../sideEffects'
import { isRunningAsSafeApp } from 'utils/safeApps'
import getENS, { getRegistrar } from './ens'
import {
  GET_ALL_NODES,
  GET_REGISTRANT_FROM_SUBGRAPH
} from '../../graphql/queries'
import getClient from '../apolloClient'
import modeNames from '../../api/modes'
import { emptyAddress, ROPSTEN_DNSREGISTRAR_ADDRESS } from '../../utils/utils'

export const getWeb3Mutation = async () => {
  return web3Reactive(await getWeb3())
}

export const getNetworkMutation = async () => {
  return networkReactive(await getNetwork())
}

export const getReverseRecordMutation = async address => {
  if (address) {
    reverseRecordReactive(await getReverseRecord(address))
  }
}

export const getAccountsMutation = async () => {
  return accountsReactive(await getAccounts())
}

export const getIsReadOnlyMutation = () => {
  isReadOnlyReactive(isReadOnly())
}

export const getNetworkIdMutation = async () => {
  return networkIdReactive(await getNetworkId())
}

export const getIsRunningAsSafeAppMutation = async () => {
  return isRunningAsSafeAppReactive(isRunningAsSafeApp())
}

export const connectMutation = async address => {
  let network
  try {
    network = await connect()
  } catch (e) {
    console.error('connect mutation error: ', e)
    //setError({ variables: { message: e?.message } })
  }
  if (network) {
    console.log('network: ', network)
    networkIdReactive(await getNetworkId())
    isReadOnlyMutation()
    reverseRecordMutation(address)
  }
}

export const disconnectMutation = async () => {
  reverseRecordReactive(null)
  networkIdReactive(1)
  isReadOnlyReactive(true)
  await disconnect()
}

async function getRegistrarEntry(name) {
  const registrar = getRegistrar()
  const nameArray = name.split('.')
  if (nameArray.length > 3 || nameArray[1] !== 'eth') {
    return {}
  }

  const entry = await registrar.getEntry(nameArray[0])
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

  const node = {
    name: `${name}`,
    state: modeNames[state],
    stateError: null, // This is only used for dnssec errors
    registrationDate,
    gracePeriodEndDate: gracePeriodEndDate || null,
    migrationStartDate: migrationStartDate || null,
    currentBlockDate: currentBlockDate || null,
    transferEndDate: transferEndDate || null,
    revealDate,
    value,
    highestBid,
    registrant,
    deedOwner,
    isNewRegistrar: !!isNewRegistrar,
    available,
    expiryTime: expiryTime || null
  }

  return node
}

async function getParent(name) {
  const ens = getENS()
  const nameArray = name.split('.')
  if (nameArray.length < 1) {
    return [null, null]
  }
  nameArray.shift()
  const parent = nameArray.join('.')
  const parentOwner = await ens.getOwner(parent)
  return [parent, parentOwner]
}

async function getRegistrant(name) {
  const client = getClient()
  try {
    const { data, error } = await client.query({
      query: GET_REGISTRANT_FROM_SUBGRAPH,
      fetchPolicy: 'network-only',
      variables: { id: labelhash(name.split('.')[0]) }
    })
    if (!data || !data.registration) {
      return null
    }
    if (error) {
      console.log('Error getting registrant from subgraph', error)
      return null
    }

    return utils.getAddress(data.registration.registrant.id)
  } catch (e) {
    console.log('GraphQL error from getRegistrant', e)
    return null
  }
}

async function getDNSEntryDetails(name) {
  const ens = getENS()
  const registrar = getRegistrar()
  const nameArray = name.split('.')
  const networkId = await getNetworkId()
  if (nameArray.length !== 2 || nameArray[1] === 'eth') return {}

  let tld = nameArray[1]
  let owner
  let tldowner
  tldowner = (await ens.getOwner(tld)).toLocaleLowerCase()
  if (parseInt(tldowner) === 0 && networkId === 3) {
    tldowner = ROPSTEN_DNSREGISTRAR_ADDRESS
  }

  try {
    owner = (await ens.getOwner(name)).toLocaleLowerCase()
  } catch {
    return {}
  }

  let isDNSRegistrarSupported = await registrar.isDNSRegistrar(tldowner)
  if (isDNSRegistrarSupported && tldowner !== emptyAddress) {
    const dnsEntry = await registrar.getDNSEntry(name, tldowner, owner)
    const node = {
      isDNSRegistrar: true,
      dnsOwner: dnsEntry.claim?.result
        ? dnsEntry.claim.getOwner()
        : emptyAddress,
      state: dnsEntry.state,
      stateError: dnsEntry.stateError,
      parentOwner: tldowner
    }

    return node
  }
}

async function getTestEntry(name) {
  const registrar = getRegistrar()
  const nameArray = name.split('.')
  if (nameArray.length < 3 && nameArray[1] === 'test') {
    const expiryTime = await registrar.expiryTimes(nameArray[0])
    if (expiryTime) return { expiryTime }
  }
  return {}
}

const waitForReactiveVar = varReactive =>
  new Promise((resolve, reject) => {
    let count = 0
    const interval = setInterval(() => {
      if (count === 5) {
        reject('too many retries')
      }
      if (varReactive()) {
        resolve(varReactive())
      }
      count++
    }, 1000)
  })

function adjustForShortNames(node) {
  const nameArray = node.name.split('.')
  const { label, parent } = node

  // return original node if is subdomain or not eth
  if (nameArray.length > 2 || parent !== 'eth' || label.length > 6) return node

  //if the auctions are over
  if (new Date() > new Date(1570924800000)) {
    return node
  }

  let auctionEnds
  let onAuction = true

  if (label.length >= 5) {
    auctionEnds = new Date(1569715200000) // 29 September
  } else if (label.length >= 4) {
    auctionEnds = new Date(1570320000000) // 6 October
  } else if (label.length >= 3) {
    auctionEnds = new Date(1570924800000) // 13 October
  }

  if (new Date() > auctionEnds) {
    onAuction = false
  }

  return {
    ...node,
    auctionEnds,
    onAuction,
    state: onAuction ? 'Auction' : node.state
  }
}

export const singleNameMutation = async name => {
  try {
    await waitForReactiveVar(isENSReady)

    const ens = getENS()

    const decrypted = isDecrypted(name)
    let node = { ...detailedNodeReactive(), decrypted }
    const dataSources = [
      getRegistrarEntry(name),
      ens.getDomainDetails(name),
      getParent(name),
      getDNSEntryDetails(name),
      getTestEntry(name),
      getRegistrant(name)
    ]

    const [
      registrarEntry,
      domainDetails,
      [parent, parentOwner],
      dnsEntry,
      testEntry,
      registrant
    ] = await Promise.all(dataSources)

    //const { names } = cache.readQuery({ query: GET_ALL_NODES })

    let detailedNode = adjustForShortNames({
      ...node,
      ...registrarEntry,
      ...domainDetails,
      ...dnsEntry,
      ...testEntry,
      registrant: registrant
        ? registrant
        : registrarEntry.registrant
        ? registrarEntry.registrant
        : null,
      parent,
      parentOwner,
      __typename: 'Node'
    })

    //detailedNode = setState(detailedNode)
    // Override parentOwner for dns if exists
    if (
      dnsEntry &&
      dnsEntry.parentOwner &&
      parseInt(dnsEntry.parentOwner) !== 0 &&
      parseInt(detailedNode.parentOwner) === 0
    ) {
      detailedNode.parentOwner = dnsEntry.parentOwner
    }
    // const data = {
    //   names: [...names, detailedNode]
    // }
    const data = {
      names: [detailedNode]
    }

    //cache.writeData({ data })

    //return detailedNodeReactive([...names, detailedNode])
    return detailedNodeReactive(detailedNode)
  } catch (e) {
    console.log('Error in Single Name', e)
    throw e
  }
}

export const getFavouritesMutation = () => {
  favouritesReactive(
    JSON.parse(window.localStorage.getItem('ensFavourites')) || []
  )
}

export const getSubDomainFavouritesMutation = () => {
  subDomainFavouritesReactive(
    JSON.parse(window.localStorage.getItem('ensSubDomainFavourites')) || []
  )
}

export const addFavouriteMutation = domain => {
  const favourites = [...favouritesReactive(), domain]
  window.localStorage.setItem('ensFavourites', JSON.stringify(favourites))
  return favouritesReactive(favourites)
}

export const deleteFavouriteMutation = domain => {
  const previous = favouritesReactive()
  const favourites = previous.filter(
    previousDomain => previousDomain.name !== domain.name
  )
  window.localStorage.setItem('ensFavourites', JSON.stringify(favourites))
  return favouritesReactive(favourites)
}

export const addSubDomainFavouriteMutation = domain => {
  const subDomainFavourites = [...subDomainFavouritesReactive(), domain]
  window.localStorage.setItem(
    'ensSubDomainFavourites',
    JSON.stringify(subDomainFavourites)
  )
  return subDomainFavouritesReactive(subDomainFavourites)
}

export const deleteSubDomainFavouriteMutation = domain => {
  const subDomainFavourites = subDomainFavouritesReactive().filter(
    previousDomain => previousDomain.name !== domain.name
  )
  window.localStorage.setItem(
    'ensSubDomainFavourites',
    JSON.stringify(subDomainFavourites)
  )
  return subDomainFavourites
}

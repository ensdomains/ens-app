import getENS, { getNamehash, getResolverContract } from './ens'
import getWeb3, { getWeb3Read, getAccount, getBlock } from './web3'
import { abi as legacyAuctionRegistrarContract } from '@ensdomains/ens/build/contracts/HashRegistrar'
import { abi as deedContract } from '@ensdomains/ens/build/contracts/Deed'
import { abi as permanentRegistrarContract } from '@ensdomains/ethregistrar/build/contracts/BaseRegistrarImplementation'
import { abi as permanentRegistrarControllerContract } from '@ensdomains/ethregistrar/build/contracts/ETHRegistrarController'
import {
  legacyRegistrar as legacyRegistrarInterfaceId,
  permanentRegistrar as permanentRegistrarInterfaceId
} from '../constants/interfaces'
let ethRegistrar
let ethRegistrarRead
let permanentRegistrar
let permanentRegistrarRead
let permanentRegistrarController
let permanentRegistrarControllerRead

export const getLegacyAuctionRegistrar = async () => {
  if (ethRegistrar) {
    return {
      ethRegistrar: ethRegistrar.methods,
      ethRegistrarRead: ethRegistrarRead.methods
    }
  }
  try {
    const web3 = await getWeb3()
    const web3Read = await getWeb3Read()
    const { Resolver } = await getEthResolver()
    let legacyAuctionRegistrarAddress = await Resolver.interfaceImplementer(
      await getNamehash('eth'),
      legacyRegistrarInterfaceId
    ).call()

    ethRegistrar = new web3.eth.Contract(
      legacyAuctionRegistrarContract,
      legacyAuctionRegistrarAddress
    )
    ethRegistrarRead = new web3Read.eth.Contract(
      legacyAuctionRegistrarContract,
      legacyAuctionRegistrarAddress
    )
    return {
      ethRegistrar,
      ethRegistrarRead
    }
  } catch (e) {}
}

export const getPermanentRegistrar = async () => {
  if (permanentRegistrar) {
    return {
      permanentRegistrar: permanentRegistrar.methods,
      permanentRegistrarRead: permanentRegistrarRead.methods
    }
  }

  try {
    const { readENS: ENS } = await getENS()
    const web3 = await getWeb3()
    const web3Read = await getWeb3Read()
    const ethAddr = await ENS.owner(await getNamehash('eth')).call()
    permanentRegistrar = new web3.eth.Contract(
      permanentRegistrarContract,
      ethAddr
    )
    permanentRegistrarRead = new web3Read.eth.Contract(
      permanentRegistrarContract,
      ethAddr
    )
    return {
      permanentRegistrar: permanentRegistrar.methods,
      permanentRegistrarRead: permanentRegistrarRead.methods
    }
  } catch (e) {}
}

export const getPermanentRegistrarController = async () => {
  if (permanentRegistrarController) {
    return {
      permanentRegistrarController: permanentRegistrarController.methods,
      _permanentRegistrarController: permanentRegistrarController,
      permanentRegistrarControllerRead:
        permanentRegistrarControllerRead.methods,
      _permanentRegistrarControllerRead: permanentRegistrarControllerRead
    }
  }

  try {
    const web3 = await getWeb3()
    const web3Read = await getWeb3Read()
    const { Resolver } = await getEthResolver()
    let controllerAddress = await Resolver.interfaceImplementer(
      await getNamehash('eth'),
      permanentRegistrarInterfaceId
    ).call()
    permanentRegistrarController = new web3.eth.Contract(
      permanentRegistrarControllerContract,
      controllerAddress
    )

    permanentRegistrarControllerRead = new web3Read.eth.Contract(
      permanentRegistrarControllerContract,
      controllerAddress
    )
    return {
      permanentRegistrarController: permanentRegistrarController.methods,
      _permanentRegistrarController: permanentRegistrarController,
      permanentRegistrarControllerRead:
        permanentRegistrarControllerRead.methods,
      _permanentRegistrarControllerRead: permanentRegistrarControllerRead
    }
  } catch (e) {}
}

const getEthResolver = async () => {
  const { readENS: ENS } = await getENS()
  const ethnamehash = await getNamehash('eth')
  const resolverAddr = await ENS.resolver(ethnamehash).call()
  return await getResolverContract(resolverAddr)
}

export const getLegacyEntry = async name => {
  let obj
  try {
    const { ethRegistrarRead: Registrar } = await getLegacyAuctionRegistrar()
    const web3 = await getWeb3()
    const namehash = web3.utils.sha3(name)
    let deedOwner = '0x0'
    const entry = await Registrar.methods.entries(namehash).call()
    if (parseInt(entry[1], 16) !== 0) {
      const deed = await getDeed(entry[1])
      deedOwner = await deed.owner().call()
    }
    obj = {
      deedOwner,
      state: parseInt(entry[0]),
      registrationDate: parseInt(entry[2]) * 1000,
      revealDate: (parseInt(entry[2]) - 24 * 2 * 60 * 60) * 1000,
      value: parseInt(entry[3]),
      highestBid: parseInt(entry[4])
    }
  } catch (e) {
    obj = {
      deedOwner: '0x0',
      state: 0,
      registrationDate: 0,
      revealDate: 0,
      value: 0,
      highestBid: 0,
      expiryTime: 0,
      error: e.message
    }
  }
  return obj
}

export const getPermanentEntry = async name => {
  let obj = {
    available: null,
    nameExpires: null
  }
  try {
    const web3 = await getWeb3()
    const namehash = web3.utils.sha3(name)
    const { permanentRegistrarRead: Registrar } = await getPermanentRegistrar()
    // Returns true if name is available
    obj.available = await Registrar.available(namehash).call()
    // This is used for old registrar to figure out when the name can be migrated.
    obj.migrationLockPeriod = parseInt(
      await Registrar.MIGRATION_LOCK_PERIOD().call()
    )
    obj.transferPeriodEnds = await Registrar.transferPeriodEnds().call()
    // Returns registrar address if owned by new registrar
    obj.ownerOf = await Registrar.ownerOf(namehash).call()
    const nameExpires = await Registrar.nameExpires(namehash).call()
    if (nameExpires > 0) {
      obj.nameExpires = new Date(nameExpires * 1000)
    }
  } catch (e) {
    obj.error = e.message
  } finally {
    return obj
  }
}

export const getDeed = async address => {
  const web3Read = await getWeb3Read()
  const deed = new web3Read.eth.Contract(deedContract, address)
  return deed.methods
}

export const getEntry = async name => {
  let legacyEntry = await getLegacyEntry(name)
  let block = await getBlock()
  let ret = {
    currentBlockDate: new Date(block.timestamp * 1000),
    registrant: 0,
    transferEndDate: null,
    isNewRegistrar: false
  }

  try {
    let permEntry = await getPermanentEntry(name)

    if (ret.registrationDate && permEntry.migrationLockPeriod) {
      ret.migrationStartDate = new Date(
        ret.registrationDate + permEntry.migrationLockPeriod * 1000
      )
    } else {
      ret.migrationStartDate = null
    }

    if (permEntry.transferPeriodEnds) {
      ret.transferEndDate = new Date(permEntry.transferPeriodEnds * 1000)
    }
    ret.available = permEntry.available
    if (!permEntry.available) {
      // Owned
      ret.state = 2
    }
    if (permEntry.ownerOf) {
      ret.isNewRegistrar = true
      ret.registrant = permEntry.ownerOf
    }
    if (permEntry.nameExpires) {
      ret.expiryTime = permEntry.nameExpires
    }
  } catch (e) {
    console.log('error getting permanent registry', e)
  }
  return {
    ...legacyEntry,
    ...ret
  }
}

export const transferOwner = async ({ to, name }) => {
  try {
    const web3 = await getWeb3()
    const nameArray = name.split('.')
    const labelHash = web3.utils.sha3(nameArray[0])
    const account = await getAccount()
    const { permanentRegistrarRead: Registrar } = await getPermanentRegistrar()
    return () =>
      Registrar.safeTransferFrom(account, to, labelHash).send({
        from: account
      })
  } catch (e) {
    console.log('error getting permanentRegistrar contract', e)
  }
}

export const reclaim = async ({ name, address }) => {
  try {
    const web3 = await getWeb3()
    const nameArray = name.split('.')
    const labelHash = web3.utils.sha3(nameArray[0])
    const account = await getAccount()
    const { permanentRegistrarRead: Registrar } = await getPermanentRegistrar()
    return () =>
      Registrar.reclaim(labelHash, address).send({
        from: account
      })
  } catch (e) {
    console.log('error getting permanentRegistrar contract', e)
  }
}

export const getRentPrice = async (name, duration) => {
  const {
    permanentRegistrarControllerRead
  } = await getPermanentRegistrarController()

  const price = await permanentRegistrarControllerRead
    .rentPrice(name, duration)
    .call()

  return price
}

export const getMinimumCommitmentAge = async () => {
  const {
    permanentRegistrarControllerRead
  } = await getPermanentRegistrarController()
  return await permanentRegistrarControllerRead.minCommitmentAge().call()
}

export const makeCommitment = async (name, owner, secret = '') => {
  const {
    permanentRegistrarControllerRead
  } = await getPermanentRegistrarController()

  const commitment = await permanentRegistrarControllerRead
    .makeCommitment(name, owner, secret)
    .call()

  return commitment
}

export const commit = async (label, secret = '') => {
  const {
    permanentRegistrarController
  } = await getPermanentRegistrarController()
  const account = await getAccount()

  const commitment = await makeCommitment(label, account, secret)

  return () =>
    permanentRegistrarController.commit(commitment).send({ from: account })
}

export const register = async (label, duration, secret) => {
  const {
    permanentRegistrarController
  } = await getPermanentRegistrarController()
  const account = await getAccount()
  const price = await getRentPrice(label, duration)

  return () =>
    permanentRegistrarController
      .register(label, account, duration, secret)
      .send({ from: account, gas: 1000000, value: price })
}

export const renew = async (label, duration) => {
  const {
    permanentRegistrarController
  } = await getPermanentRegistrarController()
  const account = await getAccount()
  const price = await getRentPrice(label, duration)

  return () =>
    permanentRegistrarController
      .renew(label, duration)
      .send({ from: account, gas: 1000000, value: price })
}

export const createSealedBid = async (name, bidAmount, secret) => {
  const Registrar = await getLegacyAuctionRegistrar()
  const web3 = await getWeb3()
  const account = await getAccount()
  const namehash = web3.sha3(name)

  return Registrar.methods
    .shaBid(
      namehash,
      account,
      web3.utils.toWei(bidAmount, 'ether'),
      web3.utils.sha3(secret)
    )
    .send({ from: account })
}

export const newBid = async (sealedBid, decoyBidAmount) => {
  const Registrar = await getLegacyAuctionRegistrar()
  const web3 = await getWeb3()
  const account = await getAccount()

  return Registrar.methodsnewBid(sealedBid).send({
    from: account,
    value: web3.utils.toWei(decoyBidAmount, 'ether')
  })
}

export const startAuctionsAndBid = async (
  hashes,
  sealedBid,
  decoyBidAmount
) => {
  const Registrar = await getLegacyAuctionRegistrar()
  const web3 = await getWeb3()
  const account = await getAccount()

  return Registrar.startAuctionsAndBid(hashes, sealedBid()).send({
    from: account,
    value: web3.utils.toWei(decoyBidAmount, 'ether')
  })
}

export const transferRegistrars = async label => {
  const { ethRegistrar } = await getLegacyAuctionRegistrar()
  const account = await getAccount()
  const web3 = await getWeb3()
  const hash = web3.utils.sha3(label)
  const tx = ethRegistrar.transferRegistrars(hash)
  const gas = await tx.estimateGas({ from: account })
  return () =>
    tx.send({
      from: account,
      gas: gas
    })
}

export const releaseDeed = async label => {
  const { ethRegistrar } = await getLegacyAuctionRegistrar()
  const account = await getAccount()
  const web3 = await getWeb3()
  const hash = web3.utils.sha3(label)
  const tx = ethRegistrar.releaseDeed(hash)
  const gas = await tx.estimateGas({ from: account })
  return () =>
    tx.send({
      from: account,
      gas: gas
    })
}

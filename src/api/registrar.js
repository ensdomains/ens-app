import getENS, { getNamehash } from './ens'
import getWeb3, { getWeb3Read, getAccount } from './web3'
import { abi as auctionRegistrarContract } from '../../node_modules/@ensdomains/ens/build/contracts/HashRegistrar.json'

let ethRegistrar
let ethRegistrarRead

export const getAuctionRegistrar = async () => {
  if (ethRegistrar) {
    return {
      ethRegistrar,
      ethRegistrarRead
    }
  }
  try {
    const { readENS: ENS } = await getENS()
    const web3 = await getWeb3()
    const web3Read = await getWeb3Read()
    const ethAddr = await ENS.owner(await getNamehash('eth')).call()
    ethRegistrar = new web3.eth.Contract(auctionRegistrarContract, ethAddr)
    ethRegistrarRead = new web3Read.eth.Contract(
      auctionRegistrarContract,
      ethAddr
    )
    return {
      ethRegistrar,
      ethRegistrarRead
    }
  } catch (e) {}
}

export const getEntry = async name => {
  const { ethRegistrarRead: Registrar } = await getAuctionRegistrar()
  const web3 = await getWeb3()
  const namehash = web3.utils.sha3(name)
  try {
    const entry = await Registrar.methods.entries(namehash).call()
    return {
      state: parseInt(entry[0]),
      registrationDate: parseInt(entry[2]) * 1000,
      revealDate: (parseInt(entry[2]) - 24 * 2 * 60 * 60) * 1000,
      value: parseInt(entry[3]),
      highestBid: parseInt(entry[4]),
      _entry: entry
    }
  } catch (e) {
    console.log('error getting auction entry', e)
    return {
      state: 0,
      registrationDate: 0,
      revealDate: 0,
      value: 0,
      highestBid: 0
    }
  }
}

export const createSealedBid = async (name, bidAmount, secret) => {
  const Registrar = await getAuctionRegistrar()
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
  const Registrar = await getAuctionRegistrar()
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
  const Registrar = await getAuctionRegistrar()
  const web3 = await getWeb3()
  const account = await getAccount()

  return Registrar.startAuctionsAndBid(hashes, sealedBid()).send({
    from: account,
    value: web3.utils.toWei(decoyBidAmount, 'ether')
  })
}

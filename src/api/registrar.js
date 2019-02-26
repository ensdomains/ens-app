import getENS, { getNamehash } from './ens'
import getWeb3, { getWeb3Read, getAccount } from './web3'
import { abi as auctionRegistrarContract } from '@ensdomains/ens/build/contracts/HashRegistrar'
import { abi as permanentRegistrarContract } from '@ensdomains/ethregistrar/build/contracts/BaseRegistrarImplementation'

let ethRegistrar
let ethRegistrarRead
let permanentRegistrar
let permanentRegistrarRead

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

export const getPermanentRegistrar = async () => {
  if (permanentRegistrar) {
    return {
      permanentRegistrar,
      permanentRegistrarRead
    }
  }
  
  try {
    const { readENS: ENS } = await getENS()
    const web3 = await getWeb3()
    const web3Read = await getWeb3Read()
    const ethAddr = await ENS.owner(await getNamehash('eth')).call()
    permanentRegistrar = new web3.eth.Contract(permanentRegistrarContract, ethAddr)
    permanentRegistrarRead = new web3Read.eth.Contract(
      permanentRegistrarContract,
      ethAddr
    )
    return {
      permanentRegistrar,
      permanentRegistrarRead
    }
  } catch (e) {}
}

export const getPermanentEntry = async name => {
  let obj = {
    available:null,
    nameExpires:null
  }
  try{
    const web3 = await getWeb3()
    const namehash = web3.utils.sha3(name)
    const { permanentRegistrarRead: Registrar } = await getPermanentRegistrar()
    obj.available = await Registrar.methods.available(namehash).call()
    const nameExpires = await Registrar.methods.nameExpires(namehash).call()
    if(nameExpires > 0){
      obj.nameExpires = new Date(nameExpires * 1000)
    }
  }catch(e){
    console.log('error getting permanentRegistrar contract', e)
  }
  return obj
}

export const getEntry = async name => {
  const { ethRegistrarRead: Registrar } = await getAuctionRegistrar()
  let obj
  
  const web3 = await getWeb3()
  const namehash = web3.utils.sha3(name)
  try {
    const entry = await Registrar.methods.entries(namehash).call()
    obj = {
      state: parseInt(entry[0]),
      registrationDate: parseInt(entry[2]) * 1000,
      revealDate: (parseInt(entry[2]) - 24 * 2 * 60 * 60) * 1000,
      value: parseInt(entry[3]),
      highestBid: parseInt(entry[4]),
      _entry: entry
    }
  } catch (e) {
    console.log('error getting auction entry', e)
    obj = {
      state: 0,
      registrationDate: 0,
      revealDate: 0,
      value: 0,
      highestBid: 0,
      expiryTime:0
    }
  }
  try{
    let permEntry = await getPermanentEntry(name)
    if(!permEntry.available ){
      // Owned
      obj.state = 2
    }
    if(permEntry.nameExpires){
      obj.expiryTime = permEntry.nameExpires
    }
  } catch(e){
    console.log('error getting permanent registry', e)
  }
  return obj
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

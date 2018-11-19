import getENS from './ens'
import getWeb3, { getAccount } from './web31'
import auctionRegistrarContract from './contracts/auctionRegistrarContract.json'

let ethRegistrar

export const getAuctionRegistrar = async () => {
  if (ethRegistrar) {
    return { Registrar: ethRegistrar }
  }
  let { ENS } = await getENS()
  const web3 = await getWeb3()
  const ethAddr = await ENS.owner('eth')
  ethRegistrar = new web3.eth.Contract(auctionRegistrarContract, ethAddr)
  return ethRegistrar
}

export const getEntry = async name => {
  const Registrar = await getAuctionRegistrar()
  const web3 = await getWeb3()
  const namehash = web3.utils.sha3(name)
  const entry = await Registrar.methods.entries(namehash).call()
  return {
    state: parseInt(entry[0]),
    registrationDate: parseInt(entry[2]) * 1000,
    revealDate: (parseInt(entry[2]) - 24 * 3 * 60 * 60) * 1000,
    value: parseInt(entry[3]),
    highestBid: parseInt(entry[4]),
    _entry: entry
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

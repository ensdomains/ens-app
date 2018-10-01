import getENS from './ens'
import getWeb3, { getAccounts } from './web3'
import auctionRegistrarContract from './contracts/auctionRegistrarContract.json'

let ethRegistrar

export const getAuctionRegistrar = async () => {
  if (ethRegistrar) {
    return { Registrar: ethRegistrar }
  }
  let { ENS, web3 } = await getENS()
  const ethAddr = await ENS.owner('eth')
  ethRegistrar = web3.eth.contract(auctionRegistrarContract).at(ethAddr)
  return { Registrar: ethRegistrar }
}

export const getEntry = async name => {
  const { Registrar } = await getAuctionRegistrar()
  const { web3 } = await getWeb3()
  const namehash = web3.sha3(name)
  return new Promise((resolve, reject) => {
    Registrar.entries(namehash, (err, entry) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          state: entry[0].toNumber(),
          registrationDate: entry[2].toNumber() * 1000,
          revealDate: (entry[2].toNumber() - 24 * 3 * 60 * 60) * 1000,
          value: entry[3].toNumber(),
          highestBid: entry[4].toNumber(),
          _entry: entry
        })
      }
    })
  })
}

export const createSealedBid = async (name, bidAmount, secret) => {
  const { Registrar } = await getAuctionRegistrar()
  const { web3 } = await getWeb3()
  const accounts = await getAccounts()
  const namehash = web3.sha3(name)

  return new Promise((resolve, reject) => {
    Registrar.shaBid(
      namehash,
      accounts[0],
      web3.toWei(bidAmount, 'ether'),
      web3.sha3(secret),
      (err, bid) => {
        if (err) {
          reject(err)
        } else {
          resolve(bid)
        }
      }
    )
  })
}

export const newBid = async (sealedBid, decoyBidAmount) => {
  const { Registrar } = await getAuctionRegistrar()
  const { web3 } = await getWeb3()
  const accounts = await getAccounts()

  return new Promise((resolve, reject) => {
    Registrar.newBid(
      sealedBid,
      { from: accounts[0], value: web3.toWei(decoyBidAmount, 'ether') },
      (err, txId) => {
        if (err) {
          reject(err)
        } else {
          resolve(txId)
        }
      }
    )
  })
}

export const startAuctionsAndBid = async (
  hashes,
  sealedBid,
  decoyBidAmount
) => {
  const { Registrar } = await getAuctionRegistrar()
  const { web3 } = await getWeb3()
  const accounts = await getAccounts()

  return new Promise((resolve, reject) => {
    Registrar.startAuctionsAndBid(
      hashes,
      sealedBid,
      { from: accounts[0], value: web3.toWei(decoyBidAmount, 'ether') },
      (err, txId) => {
        if (err) {
          reject(err)
        } else {
          resolve(txId)
        }
      }
    )
  })
}

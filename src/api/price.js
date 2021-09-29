import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui'
import getENS, { getRegistrar } from 'apollo/mutations/ens'

const ChainLinkABI = [
  {
    constant: true,
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', type: 'int256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

async function getContract() {
  let contractAddress
  try {
    const ens = getENS()
    contractAddress = await ens.getAddress('eth-usd.data.eth')
  } catch {
    //return mainnet if it does not exist
    contractAddress = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
  }
  return contractAddress
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId()
    const networkProvider = getNetworkProviderUrl(`${network}`)
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)

    const ethUsdContract = new ethers.Contract(
      await getContract(),
      ChainLinkABI,
      provider
    )
    const price = (await ethUsdContract.latestAnswer()).toNumber() / 100000000
    return price
  } catch (e) {
    console.log(e, 'error getting usd price oracle')
  }
}

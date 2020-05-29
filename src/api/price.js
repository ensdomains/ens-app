import {
  getWeb3,
  ethers,
  getNetworkId,
  getNetworkProviderUrl
} from '@ensdomains/ui'

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

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId()
    const networkProvider = getNetworkProviderUrl()
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)
    const ethUsdContract = new ethers.Contract(
      '0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F',
      ChainLinkABI,
      provider
    )
    const price = (await ethUsdContract.latestAnswer()).toNumber() / 100000000
    return price
  } catch (e) {
    console.log(e, 'error getting usd price oracle')
  }
}

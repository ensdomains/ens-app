import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui'

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

function getContract(network) {
  // No chainlink deployed on Goerli
  // https://docs.chain.link/docs/ethereum-addresses
  const contracts = {
    1: '0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F',
    3: '0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507',
    4: '0x0bF4e7bf3e1f6D6Dc29AA516A33134985cC3A5aA',
    42: '0xD21912D8762078598283B14cbA40Cb4bFCb87581'
  }
  if (contracts[network]) {
    return contracts[network]
  }

  //return mainnet if on private net
  return '0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F'
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId()
    const networkProvider = getNetworkProviderUrl(`${network}`)
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)

    const ethUsdContract = new ethers.Contract(
      getContract(network),
      ChainLinkABI,
      provider
    )
    const price = (await ethUsdContract.latestAnswer()).toNumber() / 100000000
    return price
  } catch (e) {
    console.log(e, 'error getting usd price oracle')
  }
}

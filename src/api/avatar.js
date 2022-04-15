import { utils as avtUtils } from '@ensdomains/ens-avatar'
import { ethers, getNetworkProviderUrl } from '@ensdomains/ui'

const specs = {
  erc721: {
    abi: [
      'function tokenURI(uint256 tokenId) external view returns (string memory)'
    ],
    tokenURI: (contract, id) => contract.tokenURI(id)
  },
  erc1155: {
    abi: ['function uri(uint256 _id) public view returns (string memory)'],
    tokenURI: (contract, id) => contract.uri(id)
  }
}

export default function validateTokenURI(value, _addr) {
  try {
    const { chainID, namespace, contractAddress, tokenID } = avtUtils.parseNFT(
      value
    )
    // chain id checks
    if (chainID === 2 || chainID < 1 || chainID > 5) return false
    // token/contract checks
    const spec = specs[namespace]
    if (!spec) return false

    const networkProvider = getNetworkProviderUrl(`${chainID}`)
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)
    const contract = new ethers.Contract(contractAddress, spec.abi, provider)

    return new Promise(async resolve => {
      // if there is token metadata, return as valid
      try {
        const tokenURI = await spec.tokenURI(contract, tokenID)
        resolve(!!tokenURI)
        return
      } catch (error) {
        console.warn(error)
      }
      resolve(false)
    })
  } catch (error) {
    console.warn(error)
    return false
  }
}

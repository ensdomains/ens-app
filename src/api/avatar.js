import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui'

export default async function validateTokenURI(value, addr) {
  const details = value.split('/')

  // basic validity checks
  if (value.split('/').length !== 3) return false
  if (details[0] !== 'eip155:1') return false

  const [schema, contractAddress] = details[1].split(':')
  const tokenId = ethers.BigNumber.from(details[2])

  // token/contract checks
  if (schema !== 'erc721' && schema !== 'erc1155') return false
  if (isNaN(tokenId)) return false

  try {
    const network = await getNetworkId()
    const networkProvider = getNetworkProviderUrl(`${network}`)
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)
    // set functions needed to check validity of ownership/NFT compatibility
    const ABI =
      schema === 'erc721'
        ? [
            'function tokenURI(uint256 tokenId) external view returns (string memory)',
            'function ownerOf(uint256 tokenId) public view returns (address)'
          ]
        : [
            'function uri(uint256 _id) public view returns (string memory)',
            'function balanceOf(address account, uint256 id) public view returns (uint256)'
          ]
    const contract = new ethers.Contract(contractAddress, ABI, provider)

    // if there is token metadata, and the owner of the token is the address for name, return as valid
    if (schema === 'erc721') {
      const tokenURI = await contract.tokenURI(tokenId)
      const ownerOf = await contract.ownerOf(tokenId)
      if (tokenURI && ownerOf === addr) return true
    } else {
      const uri = await contract.uri(tokenId)
      const balanceOf = await contract.balanceOf(addr, tokenId)
      if (uri && balanceOf > 0) return true
    }
    return false
  } catch (e) {
    console.warn(e)
    return false
  }
}

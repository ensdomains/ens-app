export const ETH_ADDRESS_TYPE = {
  name: 'name',
  address: 'address',
  error: 'error'
}

export function getEthAddressType(address) {
  if (address.endsWith('.eth') || address === 'eth') return ETH_ADDRESS_TYPE.name
  if (address.length === 42 && ((address.startsWith('0x') && !address.endsWith('.addr.reverse')) || (address.endsWith('.addr.reverse') && !address.startsWith('0x')))) return ETH_ADDRESS_TYPE.address
  return ETH_ADDRESS_TYPE.error
}

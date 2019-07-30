import { validateName } from './utils'

export const ETH_ADDRESS_TYPE = {
  name: 'name',
  address: 'address',
  error: 'error'
}

export function getEthAddressType(address) {
  if (!address) return ETH_ADDRESS_TYPE.error

  if (
    address.length === 42 &&
    ((address.startsWith('0x') && !address.endsWith('.addr.reverse')) ||
      (address.endsWith('.addr.reverse') && !address.startsWith('0x')))
  ) {
    return ETH_ADDRESS_TYPE.address
  }

  try {
    validateName(address)
    return ETH_ADDRESS_TYPE.name
  } catch (e) {
    return ETH_ADDRESS_TYPE.name
  }
}

export function isAddress(address) {
  return address && getEthAddressType(address) === ETH_ADDRESS_TYPE.address
}

import { addressUtils } from '@0xproject/utils'

export function validateRecord({ type, value }) {
  if (type === 'address') {
    return addressUtils.isAddress(value)
  }

  return undefined
}

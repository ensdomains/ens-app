import { NAME_WRAPPER_ADDRESS } from '@ensdomains/ui/src/constants/interfaces'

const CANNOT_TRANSFER = 4

export const isWrapped = controllerAddr => {
  return controllerAddr?.toLowerCase() == NAME_WRAPPER_ADDRESS
}

const bitSet = (number, n) => number & (1 << (n - 1))

export const hasCannotTransfer = fuses => {
  if (!fuses) return true
  return bitSet(fuses, CANNOT_TRANSFER)
}

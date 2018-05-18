const HEX_REGEX = /^0x[0-9A-F]*$/i

import { addressUtils } from '@0xproject/utils'

expect.extend({
  toBeHex(received) {
    const pass = typeof received === 'string' && HEX_REGEX.test(received)

    if (pass) {
      return {
        message: () => `expected ${received} to be a Hex String`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a Hex String`,
        pass: false
      }
    }
  },
  toBeEthAddress(received) {
    const pass =
      typeof received === 'string' && addressUtils.isAddress(received)

    if (pass) {
      return {
        message: () => `expected ${received} to be an Eth address`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be an Eth address`,
        pass: false
      }
    }
  }
})

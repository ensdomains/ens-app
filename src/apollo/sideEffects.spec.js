jest.mock('./reactiveVars', () => ({
  isENSReady: jest.fn()
}))
import { isENSReady } from './reactiveVars'

jest.mock('./mutations/ens', () => ({
  __esModule: true,
  default: jest.fn()
}))
import getENS from './mutations/ens'

import { getReverseRecord } from './sideEffects'

describe('getReverseRecord', () => {
  it('should return the default object if ens is not ready', async () => {
    isENSReady.mockImplementation(() => false)
    expect(await getReverseRecord('0xaddress')).toEqual({
      name: null,
      match: false
    })
  })

  it('should return the default object if no address is given', async () => {
    isENSReady.mockImplementation(() => true)
    expect(await getReverseRecord()).toEqual({ name: null, match: false })
  })

  it('should return the default object when there is an error', async () => {
    getENS.mockImplementation(() => undefined)
    isENSReady.mockImplementation(() => true)
    expect(await getReverseRecord('0xasdfasd')).toEqual({
      name: null,
      match: false
    })
  })
})

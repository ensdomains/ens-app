/** intend to replace this with npm package */
jest.mock('../utils/embedsdk.esm', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    cleanup: jest.fn()
  }
}))

import EmbedSDK from '../utils/embedsdk.esm'

import { renderHook } from '@testing-library/react-hooks'
import { useEPNSEmbed } from './useEPNSEmbed'

describe('useEPNSEmbed', () => {
  it('should not call init() if all mandatory params are not passed', () => {
    const { rerender } = renderHook(() => useEPNSEmbed({}))

    rerender()
    expect(EmbedSDK.init).toBeCalledTimes(0)
  })

  it('should not call init() if all mandatory params are not passed', () => {
    const initOptions = {
      user: '0xaddress1',
      targetID: 'trigger-id',
      appName: 'ens'
    }

    const { rerender } = renderHook(() => useEPNSEmbed(initOptions))

    rerender()
    expect(EmbedSDK.init).toBeCalledTimes(1)

    const calledWithArgs = EmbedSDK.init.mock.calls[0][0]

    expect(calledWithArgs.user).toEqual(initOptions.user)
    expect(calledWithArgs.targetID).toEqual(initOptions.targetID)
    expect(calledWithArgs.appName).toEqual(initOptions.appName)
  })
})

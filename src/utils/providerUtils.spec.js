import { getNetworkId } from './providerUtils'

describe('getNetworkId', () => {
  it('should handle chainId style provider', () => {
    const mockProvider = {
      network: {
        chainId: '1'
      }
    }
    expect(getNetworkId(mockProvider)).toEqual('1')
  })

  it('should handle provider.network style of provider', () => {
    const mockProvider = {
      network: '1'
    }
    expect(getNetworkId(mockProvider)).toEqual('1')
  })
})

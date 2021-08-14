import { getNetworkId, getAccounts } from './providerUtils'

const mockMetamaskProvider = {
  selectedAddress: '0xaddress',
  networkVersion: '1'
}

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

  it('should handle the metamask style of provider', () => {
    expect(getNetworkId(mockMetamaskProvider)).toEqual('1')
  })
})

describe('getAccounts', () => {
  it('should get accounts from the listAccounts style of provider', async () => {
    const mockProvider = {
      listAccounts: () => {
        return new Promise(resolve => {
          resolve(['0xaddress'])
        })
      }
    }

    expect(await getAccounts(mockProvider)).toEqual(['0xaddress'])
  })
  it('should get accounts from the metamask provider', async () => {
    expect(await getAccounts(mockMetamaskProvider)).toEqual(['0xaddress'])
  })
})

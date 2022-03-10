jest.mock('@ensdomains/ui', () => ({
  isReadOnly: () => true,
  getNetworkId: () => '2',
  getNetwork: () => 'mainnet'
}))
jest.mock('../apollo/mutations/ens', () => ({
  __esModule: true,
  ...jest.requireActual('../apollo/mutations/ens'),
  setup: jest.fn()
}))
import { setup } from '../apollo/mutations/ens'
import { disconnect, setWeb3Modal } from './web3modal'

describe('disconnect', () => {
  it('should clear cached provider if using web3modal', async () => {
    const mockClearCache = jest.fn()

    const mockWeb3Modal = {
      clearCachedProvider: () =>
        new Promise(() => {
          mockClearCache()
          expect(mockClearCache).toBeCalled()
        })
    }

    setWeb3Modal(mockWeb3Modal)
    disconnect()
  })

  it('should clear cached provider before calling setupENS', () => {
    const mockClearCache = jest.fn()

    const mockWeb3Modal = {
      clearCachedProvider: () =>
        new Promise(() => {
          mockClearCache()
          expect(mockClearCache).toBeCalled()
          expect(setup).toHaveBeenCalledTimes(0)
        })
    }

    setWeb3Modal(mockWeb3Modal)
    disconnect()
  })
})

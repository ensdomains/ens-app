import { getProvider, setWeb3Provider } from './setup'

jest.mock('./apollo/mutations/ens', () => ({
  setup: jest.fn()
}))
import { setup } from './apollo/mutations/ens'

jest.mock('./api/web3modal', () => ({
  connect: jest.fn()
}))
import { connect } from './api/web3modal'

jest.mock('./apollo/reactiveVars', () => ({
  ...jest.requireActual('./apollo/reactiveVars'),
  networkIdReactive: jest.fn(),
  networkReactive: jest.fn(),
  accountsReactive: jest.fn()
}))
import {
  accountsReactive,
  networkIdReactive,
  networkReactive
} from './apollo/reactiveVars'

jest.mock('@ensdomains/ui', () => ({
  ...jest.requireActual('@ensdomains/ui'),
  getNetworkId: jest.fn(),
  getNetwork: jest.fn()
}))
import { getNetworkId, getNetwork } from '@ensdomains/ui'

jest.mock('./apollo/sideEffects', () => ({
  ...jest.requireActual('./apollo/sideEffects'),
  getReverseRecord: jest.fn()
}))
import { getReverseRecord } from './apollo/sideEffects'

describe('getProvider', () => {
  describe('local blockchain', () => {
    let originalReactAppStage
    let originalReactAppEnsAddress
    let originalReactAppLabels
    beforeAll(() => {
      originalReactAppStage = process.env.REACT_APP_STAGE
      originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS
      originalReactAppLabels = process.env.REACT_APP_LABELS
      process.env.REACT_APP_STAGE = 'local'
      process.env.REACT_APP_ENS_ADDRESS = '0xaddress'
      process.env.REACT_APP_LABELS = '{}'
    })
    afterAll(() => {
      process.env.REACT_APP_STAGE = originalReactAppStage
      process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress
      process.env.REACT_APP_LABELS = originalReactAppLabels
    })

    it('should return provider when using local blockchain', async () => {
      setup.mockImplementation(() => ({
        providerObject: { localProvider: true }
      }))
      const provider = await getProvider(false)
      expect(provider.localProvider)
    })
  })

  describe('web3 cached provider', () => {
    afterAll(() => {
      window.localStorage.clear()
    })
    it('should call connect if there is a cached provider', async () => {
      expect.assertions(1)
      window.localStorage.setItem('WEB3_CONNECT_CACHED_PROVIDER', 'injected')
      connect.mockImplementation(
        () =>
          new Promise(() => {
            expect(true).toBeTruthy()
          })
      )
      getProvider()
    })
  })

  describe('no cached provider', () => {
    it('should call setup', async () => {
      setup.mockImplementation(() => {
        return new Promise(resolve => {
          resolve({ provierObject: {} })
        })
      })
      const provider = await getProvider(false)
      expect(setup).toHaveBeenCalled()
    }, 10000)
  })

  describe('reconnect == true', () => {
    it('should call connect if reconnect == true', async () => {
      connect.mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(1)
          })
      )
      const provider = await getProvider(true)
      expect(provider).toEqual(1)
    })
  })
})

describe('setWeb3Provider', () => {
  it('should update network id when network id changes', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => '2')
    getNetwork.mockImplementation(() => 'Main')
    const mockProvider = {
      on: (event, callback) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(networkIdReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'chainChanged') {
          cb()
        }
      },
      removeAllListeners: () => null
    }
    await setWeb3Provider(mockProvider)
  })
  it('should update accounts when accounts change', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => '2')
    getNetwork.mockImplementation(() => 'Main')
    const mockProvider = {
      on: (event, callback) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(accountsReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'accountsChanged') {
          cb()
        }
      },
      removeAllListeners: () => null
    }
    await setWeb3Provider(mockProvider)
  })
  it('should remove listeners on the provider if they already exist', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => '2')
    getNetwork.mockImplementation(() => 'Main')
    const mockRemoveAllListeners = jest.fn()
    const mockProvider = {
      on: (event, callback) => {},
      removeAllListeners: mockRemoveAllListeners
    }
    await setWeb3Provider(mockProvider)
    expect(mockRemoveAllListeners).toHaveBeenCalled()
  })
  it('should update network when network changes', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => '2')
    getNetwork.mockImplementation(() => 'Main')
    const mockProvider = {
      on: (event, callback) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(networkReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'chainChanged') {
          cb()
        }
      },
      removeAllListeners: () => null
    }
    await setWeb3Provider(mockProvider)
  })
})

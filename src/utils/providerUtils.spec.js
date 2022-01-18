import { useQuery } from '@apollo/client'

jest.mock('../setup', () => ({
  __esModule: true,
  default: jest.fn()
}))
import setup from '../setup'

jest.mock('../api/web3modal', () => ({
  disconnect: jest.fn()
}))
import { disconnect } from '../api/web3modal'

jest.mock('../apollo/reactiveVars', () => ({
  accountsReactive: jest.fn(),
  isReadOnlyReactive: jest.fn(),
  reverseRecordReactive: jest.fn(),
  delegatesReactive: jest.fn()
}))
import {
  accountsReactive,
  isReadOnlyReactive,
  reverseRecordReactive
} from '../apollo/reactiveVars'

import { connectProvider, disconnectProvider } from './providerUtils'

describe('connectProvider', () => {
  it('should call setup with reconnect === true', () => {
    connectProvider()
    expect(setup).toBeCalledWith(true)
  })
})

describe('disconnectProvider', () => {
  it('should call disconnect on the provider', () => {
    disconnectProvider()
    expect(disconnect).toBeCalled()
  })
  it('should reset the correct global variables', () => {
    disconnectProvider()
    expect(isReadOnlyReactive).toBeCalledWith(true)
    expect(reverseRecordReactive).toBeCalledWith(null)
    expect(accountsReactive).toBeCalledWith(null)
  })
})

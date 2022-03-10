jest.mock('@ensdomains/ui', () => ({
  isReadOnly: () => true,
  getNetworkId: () => '2',
  getNetwork: () => 'mainnet'
}))
jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

jest.mock('../apollo/sideEffects', () => ({
  __esModule: true,
  ...jest.requireActual('../apollo/sideEffects'),
  getReverseRecord: jest.fn()
}))
import { getReverseRecord } from '../apollo/sideEffects'

import { renderHook } from '@testing-library/react-hooks'
import useReactiveVarListeners from './useReactiveVarListeners'

describe('useReactiveVarListeners', () => {
  it('should not lookup reverse record if ens is not ready', () => {
    useQuery.mockImplementation(() => ({
      data: { networkId: 1, accounts: ['0xaddr1'], isENSReady: false }
    }))

    const { rerender } = renderHook(() => useReactiveVarListeners())

    rerender()
    expect(getReverseRecord).toBeCalledTimes(0)
  })
  it('should rerun reverse record lookup when account changes', () => {
    useQuery.mockImplementation(() => ({
      data: { networkId: 1, accounts: ['0xaddr1'], isENSReady: true }
    }))

    const { rerender } = renderHook(() => useReactiveVarListeners())

    rerender()
    expect(getReverseRecord).toBeCalledTimes(2)
  })
})

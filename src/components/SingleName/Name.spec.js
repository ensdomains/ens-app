jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

import { renderHook } from '@testing-library/react-hooks'
import { useRefreshComponent } from './Name'

describe('useRefreshComponent', () => {
  it('should update key if the first element of the accounts array changes', () => {
    useQuery.mockImplementation(() => ({
      data: { accounts: ['0xaddress1', '0xaddress2'], networkId: '1' }
    }))
    const { rerender, result } = renderHook(() => useRefreshComponent())
    useQuery.mockImplementation(() => ({
      data: { accounts: ['0xaddress3', '0xaddress2'], networkId: '1' }
    }))
    rerender()
    expect(result.current).toEqual(2)
  })

  it('should update key if networkId changes', () => {
    useQuery.mockImplementation(() => ({
      data: { accounts: ['0xaddress1', '0xaddress2'], networkId: '1' }
    }))
    const { rerender, result } = renderHook(() => useRefreshComponent())
    useQuery.mockImplementation(() => ({
      data: { accounts: ['0xaddress1', '0xaddress2'], networkId: '2' }
    }))
    rerender()
    expect(result.current).toEqual(2)
  })
})

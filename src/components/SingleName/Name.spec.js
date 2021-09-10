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

describe('useNameOwner', () => {
  it.todo('should reset if name wrapper data is loading')

  describe('name is NOT wrapped', () => {
    it.todo('should return a variable indicating name is not wrapped')
    it.todo('should indicate that the wrapped name is not transferable')
    it.todo('should indicate there is no wrapper owner')

    it.todo(
      'should return the ordinary name owner if user is owner of unwrapped name'
    )
  })
  describe('name IS wrapped', () => {
    it.todo('should indicate the name is wrapped')
  })

  it.todo(
    'should reset variables if there is no domain or no address',
    () => {}
  )

  it.todo(
    'if the name is owned by the namewrapper contract, should get the owner from that contract'
  )
  it.todo(
    'if the domain is available or the owner is 0 addr, should return null'
  )
  it.todo('should return null if owner is still loading')
  it.todo('should return null if there is an error')
  it.todo('should return null if domain not provided')
  it.todo('should update if domain changes')
  it.todo('should return true if name is a wrapped name')
  it.todo('should return false if name is not a wrapped name')
  it.todo(
    'should return canTransfer == true if domain is transferable && user is owner'
  )
  it.todo('should return canTransfer == false if domain is not transferable')
})

import { renderHook } from '@testing-library/react-hooks'

jest.mock('api/price', () => ({
  __esModule: true,
  default: jest.fn()
}))
import getEtherPrice from 'api/price'

import { useAvatar, useEthPrice } from './hooks'

describe('useAvatar', () => {
  afterEach(() => {
    fetch.mockClear()
  })

  it('should not be sensitive to the case of the network name', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ image: 'image' })
      })
    )

    const { waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'MaIn', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://metadata.ens.domains/mainnet/avatar/name/meta'
    )
  })
})

describe('useEthPrice', () => {
  it('should set state if component is mounted', async () => {
    getEtherPrice.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(1)
          }, 500)
        })
    )
    const { result, waitForNextUpdate } = renderHook(() => useEthPrice())

    await waitForNextUpdate({
      timeout: 1000
    })

    expect(result.current).toEqual({ loading: false, price: 1 })
  })
  it('should not set state after unmount', async () => {
    getEtherPrice.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(1)
          }, 500)
        })
    )
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useEthPrice()
    )
    unmount()
    await new Promise(r => setTimeout(r, 1000))
    expect(result.current).toEqual({ loading: true, price: undefined })
  })
})

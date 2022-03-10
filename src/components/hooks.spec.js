import { renderHook } from '@testing-library/react-hooks'

import { useAvatar } from './hooks'

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

  it('should add ipfs gateway prefix correctly for an ipfs hash with protocol', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            image: 'ipfs://QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
          })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe(
      'https://ipfs.io/ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    )
  })

  it('should add ipfs gateway prefix correctly for an ipfs hash with protocol and subpath', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            image: 'ipfs://ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
          })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe(
      'https://ipfs.io/ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    )
  })

  it('should add ipfs gateway prefix correctly for an ipfs hash (v0)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            image: 'QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
          })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe(
      'https://ipfs.io/ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    )
  })

  it('should add ipfs gateway prefix correctly for an ipfs hash (v1)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            image: 'bafybeic46eunzrhpspfvxeangbkazynleuzi4rimp5pzwotngofc7dassq'
          })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe(
      'https://ipfs.io/ipfs/bafybeic46eunzrhpspfvxeangbkazynleuzi4rimp5pzwotngofc7dassq'
    )
  })

  it('should add ipfs gateway prefix correctly for an ipfs hash with ipfs subpath', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            image: 'ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
          })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe(
      'https://ipfs.io/ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    )
  })

  it('should not modify regular image url', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ image: 'http://url.com/rickroll.gif' })
      })
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'main', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(result.current.image).toBe('http://url.com/rickroll.gif')
  })

  it('should not return data for unknown protocol', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ image: 'image' })
      })
    )

    const { waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'MaIn', 'unknown://url.com')
    )
    // waitForNextUpdate will timeout
    await expect(waitForNextUpdate).rejects.toHaveErrorMessage
  })
})

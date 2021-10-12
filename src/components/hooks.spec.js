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

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar('avatar', 'name', 'MaIn', 'http://url.com')
    )
    await waitForNextUpdate()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://metadata.ens.domains/mainnet/avatar/name/meta'
    )
  })
})

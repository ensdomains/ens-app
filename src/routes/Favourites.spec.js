jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

import { renderHook } from '@testing-library/react-hooks'
import { useResetState } from './Favourites'
import { useResetFormOnAccountChange } from '../components/SingleName/ResolverAndRecords/Records'

describe('useResetState', () => {
  it('should reset state if networkId changes', () => {
    const setYears = jest.fn()
    const setCheckedBoxes = jest.fn()
    const setSelectAll = jest.fn()

    useQuery.mockImplementation(() => ({ data: { networkId: 1 } }))

    const { rerender } = renderHook(() =>
      useResetState(setYears, setCheckedBoxes, setSelectAll)
    )

    setYears.mockReset()
    setCheckedBoxes.mockReset()
    setSelectAll.mockReset()

    useQuery.mockImplementation(() => ({ data: { networkId: 2 } }))

    rerender()

    expect(setYears).toBeCalledWith(1)
    expect(setCheckedBoxes).toBeCalledWith({})
    expect(setSelectAll).toBeCalledWith(null)
  })
})

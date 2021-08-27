import { renderHook } from '@testing-library/react-hooks'
import { useResetFormOnAccountChange } from './Records'

describe('useResetFormOnAccountChange', () => {
  it('should reset records when there is an account change', () => {
    let account = 1
    const initialRecords = {}
    const setUpdatedRecordsMock = jest.fn()
    const stopEditingMock = jest.fn()

    const { rerender } = renderHook(() =>
      useResetFormOnAccountChange(
        account,
        initialRecords,
        setUpdatedRecordsMock,
        stopEditingMock
      )
    )

    account++
    rerender()

    expect(setUpdatedRecordsMock).toBeCalledWith(initialRecords)
  })
  it('should close confirm modal when there is an account change', () => {
    let account = 1
    const initialRecords = {}
    const setUpdatedRecordsMock = jest.fn()
    const stopEditingMock = jest.fn()

    const { rerender } = renderHook(() =>
      useResetFormOnAccountChange(
        account,
        initialRecords,
        setUpdatedRecordsMock,
        stopEditingMock
      )
    )

    account++
    rerender()

    expect(setUpdatedRecordsMock).toBeCalled()
  })
})

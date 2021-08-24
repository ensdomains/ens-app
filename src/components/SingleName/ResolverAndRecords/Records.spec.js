import { renderHook, act } from '@testing-library/react-hooks'
import { useResetFormOnAccountChange } from './Records'

describe('useResetFormOnNetworkChange', () => {
  it('should reset records when there is a network change', () => {
    let account = 1
    const initialRecords = {}
    const setUpdatedRecordsMock = jest.fn()
    const stopEditingMock = jest.fn()

    const { result, rerender } = renderHook(() =>
      useResetFormOnAccountChange(
        account,
        initialRecords,
        setUpdatedRecordsMock,
        stopEditingMock
      )
    )

    account++
    rerender()

    expect(setUpdatedRecordsMock).toBeCalledWith(intialRecords)
  })
  it.todo('should close confirm modal when there is a network change')
})

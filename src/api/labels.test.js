import { checkLabel, saveLabel } from './labels'
const KEY = 'labels'

beforeEach(() => {
  localStorage.__STORE__ = {}
})

test('should save to localStorage', () => {
  const label = 'blahblah'
  const hash =
    '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'
  saveLabel('blahblah')
  expect(localStorage.setItem).toHaveBeenLastCalledWith('labels', {
    hash: label
  })
  expect(localStorage.__STORE__['labels']).toBe({ hash: label })
  expect(Object.keys(localStorage.__STORE__).length).toBe(1)
})

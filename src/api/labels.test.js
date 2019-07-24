import { checkLabel, saveLabel } from './labels'
const KEY = 'labels'

beforeEach(() => {
  localStorage.clear()
})

function setupStorage() {
  localStorage.__STORE__[KEY] = JSON.stringify({
    '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75':
      'blahblah'
  })
}

test('should return label in localStorage', () => {
  setupStorage()
  const hash =
    '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'
  expect(
    checkLabel(
      '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'
    )
  ).toBe('blahblah')
})

test('should return undefined if label is not in localStorage', () => {
  setupStorage()
  const hash =
    '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'
  expect(
    checkLabel(
      '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f74'
    )
  ).toBe(undefined)
})

test('should save to localStorage', () => {
  const label = 'blahblah'
  const hash =
    '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'
  saveLabel('blahblah')
  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    'labels',
    JSON.stringify({
      hash: label
    })
  )
  const labels = JSON.parse(localStorage.__STORE__[KEY])
  expect(labels).toEqual({ hash: label })
  expect(Object.keys(localStorage.__STORE__).length).toBe(1)
})

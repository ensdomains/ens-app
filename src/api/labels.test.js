import {
  checkLabel,
  saveLabel,
  saveName,
  parseName,
  encodeLabel
} from './labels'
const KEY = 'labels'

const blahblahHash =
  '36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f75'

beforeEach(() => {
  localStorage.clear()
})

function setupStorage() {
  localStorage.__STORE__[KEY] = JSON.stringify({
    [blahblahHash]: 'blahblah'
  })
}

function getLabelsFromStorage() {
  return JSON.parse(localStorage.__STORE__[KEY])
}

describe('checkLabel', () => {
  test('should return undefined if label is not in localStorage', () => {
    setupStorage()
    const nonExistingHash =
      '0x36940f34a2ec6afe46b7db53e6611470cd76c4f5999209a04a670682e2c33f74'
    expect(checkLabel(nonExistingHash)).toBe(undefined)
  })
})

describe('saveLabel', () => {
  test('should save label to localStorage', () => {
    const label = 'blahblah'
    saveLabel('blahblah')
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'labels',
      JSON.stringify({
        [blahblahHash]: label
      })
    )
    const labels = getLabelsFromStorage()
    expect(labels).toEqual({ [blahblahHash]: 'blahblah' })
    expect(Object.keys(localStorage.__STORE__).length).toBe(1)
  })
})

describe('saveName', () => {
  it('should save all labels to localStorage (2)', () => {
    const name = 'vitalik.eth'
    const nameArray = ['vitalik', 'eth']
    const hashes = [
      'af2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc',
      '4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'
    ]
    saveName(name)
    const labels = getLabelsFromStorage()
    expect(labels).toEqual({
      [hashes[0]]: nameArray[0],
      [hashes[1]]: nameArray[1]
    })
  })

  it('should save all labels to localStorage (3)', () => {
    const name = 'awesome.vitalik.eth'
    const nameArray = ['awesome', 'vitalik', 'eth']
    const hashes = [
      'd17d1d80d5d7a434b56ee59bc2ed8f0fd2a890dfba40fc63344b9c3654c935ee',
      'af2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc',
      '4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'
    ]
    saveName(name)
    const labels = getLabelsFromStorage()
    expect(labels).toEqual({
      [hashes[0]]: nameArray[0],
      [hashes[1]]: nameArray[1],
      [hashes[2]]: nameArray[2]
    })
  })
})

describe('encodeLabel', () => {
  it('should return the encoded labelhash if the label is a 32 bytes hexadecimal string', () => {
    const hash = '0x' + blahblahHash
    const encodedLabelHash = `[${blahblahHash}]`
    const label = encodeLabel(hash)
    expect(label).toEqual(encodedLabelHash)
  })

  it('should return the label if the label is not a 32 bytes hexadecimal string', () => {
    const label = 'awesome'
    const parsedLabel = encodeLabel(label)
    expect(parsedLabel).toEqual(label)
  })
})

describe('parseName', () => {
  it('should parse all the labels (2) and return the encoded string', () => {
    const name = 'vitalik.eth'
    const parsedName = parseName(name)
    expect(parsedName).toEqual(name)
  })

  it('should parse all the labels (3) and return the encoded string', () => {
    const name = `0x${blahblahHash}.vitalik.eth`
    const encodedName = `[${blahblahHash}].vitalik.eth`
    const parsedName = parseName(name)
    expect(parsedName).toEqual(encodedName)
  })
})

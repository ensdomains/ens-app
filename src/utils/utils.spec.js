import { CID } from 'multiformats'
import { isCID, isOwnerOfParentDomain, normaliseOrMark } from './utils'

jest.mock('../apollo/reactiveVars', () => ({
  __esModule: true
}))

describe('isOwnerOfParentDomain', () => {
  it('should return false if address is not provided', () => {
    const mockDomain = {
      parentOwner: '0xaddress'
    }
    expect(isOwnerOfParentDomain(mockDomain, null)).toBeFalsy()
  })
})

describe('isCID', () => {
  it('should return false if given hash is not ipfs hash', () => {
    const ipfsHash = 'ENSbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    expect(isCID(ipfsHash)).toBeFalsy()
  })
  it('should return true if given hash is ipfs hash (v0)', () => {
    const ipfsHash = 'QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    expect(isCID(ipfsHash)).toBeTruthy()
  })
  it('should return true if given hash is ipfs hash (v1)', () => {
    const ipfsHash =
      'bafybeic46eunzrhpspfvxeangbkazynleuzi4rimp5pzwotngofc7dassq'
    expect(isCID(ipfsHash)).toBeTruthy()
  })
  it('should return false if given hash is ipfs hash with subpath', () => {
    const ipfsHash = '/ipfs/QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    expect(isCID(ipfsHash)).toBeFalsy()
  })
  it('should return false if given hash is ipfs hash with protocol', () => {
    const ipfsHash = 'ipfs://QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP'
    expect(isCID(ipfsHash)).toBeFalsy()
  })
  it('should return true if given hash is CID', () => {
    const ipfsHash = CID.parse('QmUbTVz1L4uEvAPg5QcSu8Pow1YdwshDJ8VbyYjWaJv4JP')
    expect(isCID(ipfsHash)).toBeTruthy()
  })
})

describe('normaliseOrMark', () => {
  const invalidName = '🏳%EF%B8%8F%E2%80%8D🌈.eth'
  let mockData = [{ name: 'ensfairy.eth' }, { name: invalidName }]

  it('should return all names', () => {
    const result = normaliseOrMark(mockData, 'name')
    expect(result.length).toBe(2)
  })
  it('should return an invalid name with a warning indicator for invalid name', () => {
    const result = normaliseOrMark(mockData, 'name')
    expect(
      result.find(x => x.name === invalidName).hasInvalidCharacter
    ).toBeTruthy()
  })

  it('should return an invalid name with a warning indicator for invalid namehash', () => {
    mockData = [
      // correct
      {
        name: 'sload.eth',
        id: '0xffbc90bb419dda442595117ac481f8b15cfdbf1884d15cf2290c4cea5349c27d'
      },
      // invalid (a name with a null byte suffix,)
      {
        name: 'sload.eth',
        id: '0xf1cc8e202048c1fdfb2154fe7e19b095c51effc73ee4e6cd50f006ce6242e1d9'
      }
    ]
    const result = normaliseOrMark(mockData, 'labelName')
    expect(result.filter(x => x.hasInvalidCharacter).length).toBe(1)
  })
})

import { CID } from 'multiformats'
import { isCID, isOwnerOfParentDomain } from './utils'

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

import { isOwnerOfParentDomain } from './utils'

describe('isOwnerOfParentDomain', () => {
  it('should return false if address is not provided', () => {
    const mockDomain = {
      parentOwner: '0xaddress'
    }
    expect(isOwnerOfParentDomain(mockDomain, null)).toBeFalsy()
  })
  it.todo('should return true if the name is wrapped, false otherwise')
})

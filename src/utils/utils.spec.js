import { isOwnerOfParentDpomain } from './utils'
import { isOwnerOfParentDomain } from '../components/SingleName/Name'

describe('isOwnerOfParentDomain', () => {
  it('should return false if address is not provided', () => {
    const mockDomain = {
      parentOwner: '0xaddress'
    }
    expect(isOwnerOfParentDomain(mockDomain, null)).toBeFalsy()
  })
})

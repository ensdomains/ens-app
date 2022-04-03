import { isOwnerOfParentDomain, normaliseOrMark } from './utils'

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

describe('normaliseOrMark', () => {
  const invalidName = '🏳%EF%B8%8F%E2%80%8D🌈.eth'
  const mockData = [{ name: 'ensfairy.eth' }, { name: invalidName }]

  it('should return all names', () => {
    const result = normaliseOrMark(mockData, 'name')
    expect(result.length).toBe(2)
  })
  it('should return an invalid name with a warning indicator', () => {
    const result = normaliseOrMark(mockData, 'name')
    expect(
      result.find(x => x.name === invalidName).hasInvalidCharacter
    ).toBeTruthy()
  })
})

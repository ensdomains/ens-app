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

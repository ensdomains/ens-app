import getReverseRecord from './getReverseRecord'

jest.mock('../../apollo/mutations/ens', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../apollo/reactiveVars', () => ({
  __esModule: true,
  isENSReadyReactive: jest.fn()
}))
import { emptyAddress } from '../../utils/utils'

describe('getReverseRecord', () => {
  it('should return a default object if ens has not been initied yet', async () => {
    const result = await getReverseRecord(null, { address: '0xaddr1' })
    expect(result).toEqual({
      name: emptyAddress,
      address: '0xaddr1',
      avatar: '',
      match: false,
      __typename: 'ReverseRecord'
    })
  })
})

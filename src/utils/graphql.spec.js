import { getQueryName } from './graphql'

describe('getQueryName', () => {
  it('should return the correct query name', () => {
    const mockQuery = {
      definitions: [
        {
          name: {
            value: 'value'
          }
        }
      ]
    }
    expect(getQueryName(mockQuery)).toEqual('value')
  })
})

import { visit } from 'graphql'

import { enter, updateResponse } from './apolloClient'

describe('namehashCheckLink', () => {
  describe('enter', () => {
    it('should add id to a SelectionSet if name is present and id is not', () => {
      const graphqlAst = [
        {
          kind: 'OperationDefinition',
          operation: 'query',
          name: {
            kind: 'Name',
            value: 'getRegistrations'
          },
          variableDefinitions: [],
          directives: [],
          selectionSet: {
            kind: 'SelectionSet',
            selections: [
              {
                kind: 'Field',
                name: {
                  kind: 'Name',
                  value: 'name'
                },
                arguments: [],
                directives: []
              }
            ]
          }
        }
      ]

      const updatedQuery = visit(graphqlAst, { enter })
      expect(updatedQuery[0].selectionSet.selections[1].name.value).toEqual(
        'id'
      )
    })
  })

  describe('updateResponse', () => {
    const mockResponse = {
      data: {
        account: {
          registrations: [
            {
              expiryDate: '1680392713',
              domain: {
                id:
                  '0xf1cc8e202048c1fdfb2154fe7e19b095c51effc73ee4e6cd50f006ce6242e1d9',
                labelName: 'sload',
                labelhash:
                  '0x3ce5104b7e095f1da4813bc8cfb34e760b7baa688e47e078597322372a6af0b4',
                name: 'sload.eth',
                isMigrated: true,
                __typename: 'Domain',
                invalidName: true
              },
              __typename: 'Registration'
            }
          ],
          __typename: 'Account'
        }
      }
    }
    it('should replace name with the namehash when there is an invalid name and id combo', () => {
      const response = updateResponse(mockResponse)
      expect(response.data.account.registrations[0].domain.name).toEqual(
        '0xffbc90bb419dda442595117ac481f8b15cfdbf1884d15cf2290c4cea5349c27d'
      )
    })
  })
})

import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import DomainInfoContainer from '../DomainInfo'

afterEach(cleanup)

test('should call resolver without blowing up', () => {
  const resolverOverwrites = {
    Query: () => ({
      domainState() {
        console.log('here')
        return {
          name: 'vitalik.eth',
          state: 'Forbidden',
          __typename: 'NodeState'
        }
      }
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <DomainInfoContainer />
    </ApolloProvider>
  )
})

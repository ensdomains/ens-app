import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate,
  waitForElement
} from 'react-testing-library'

import 'dom-testing-library/extend-expect'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import DomainInfoContainer from '../DomainInfo'

afterEach(cleanup)

test('should call resolver without blowing up', async () => {
  const resolverOverwrites = {
    Query: () => ({
      domainState() {
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

  const element = await waitForElement(() =>
    getByText('vitalik.eth', { exact: false })
  )

  expect(element).toHaveTextContent('Forbidden')
})

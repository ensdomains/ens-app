import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate,
  wait
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import SubDomainResults from '../SubDomainResults'

afterEach(cleanup)

test('should call resolver without blowing up', async () => {
  const trackResolver = jest.fn()
  const resolverOverwrites = {
    Query: () => ({
      subDomainState() {
        trackResolver()
        return []
      }
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <SubDomainResults />
    </ApolloProvider>
  )

  await wait()

  console.log(container.innerHTML)

  expect(trackResolver).toHaveBeenCalledTimes(1)
})

test('should return a list of domain states', async () => {
  const resolverOverwrites = {
    Query: () => ({
      subDomainState() {
        return [
          {
            label: 'vitalik',
            domain: 'ethereum',
            price: 10000000000,
            available: true,
            rent: 0,
            referralFeePPM: 0
          }
        ]
      }
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <SubDomainResults />
    </ApolloProvider>
  )

  await wait()

  console.log(container.innerHTML)
})

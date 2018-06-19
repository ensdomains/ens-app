import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate,
  wait
} from 'react-testing-library'

import 'dom-testing-library/extend-expect'
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
            price: '1000000000000000',
            available: true,
            rent: '100000',
            referralFeePPM: '100000'
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
  const vitalik = getByText('vitalik', { exact: false })
  expect(vitalik).toHaveTextContent('vitalik.ethereum.eth')
  expect(vitalik).toHaveTextContent('0.001 ETH')
})

test('should sort domains correctly with available on top', async () => {
  const resolverOverwrites = {
    Query: () => ({
      subDomainState() {
        return [
          {
            label: 'vitalik',
            domain: 'etherbase',
            price: '1000000000000000',
            available: false,
            rent: '100000',
            referralFeePPM: '100000'
          },
          {
            label: 'vitalik',
            domain: 'yourass',
            price: '1000000000000000',
            available: true,
            rent: '100000',
            referralFeePPM: '100000'
          },
          {
            label: 'vitalik',
            domain: 'ethereum',
            price: '1000000000000000',
            available: false,
            rent: '100000',
            referralFeePPM: '100000'
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
  const vitalik = getByText('vitalik', { exact: false }) // first item with vitalik
  expect(vitalik).toHaveTextContent('vitalik.yourass.eth')
  expect(vitalik).toHaveTextContent('0.001 ETH')
})

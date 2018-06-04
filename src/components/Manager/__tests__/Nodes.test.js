import React from 'react'
import NodesContainer, { Nodes } from '../Nodes'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import { render, waitForElement, Simulate } from 'react-testing-library'
import 'dom-testing-library/extend-expect'

test('check Nodes renders', () => {
  const { getByText, container } = render(
    <ApolloProvider client={createClient()}>
      <Nodes nodes={[]} />
    </ApolloProvider>
  )
})

test('check Nodes renders items', () => {
  const nodes = [
    {
      name: 'vitalik.eth',
      owner: '0x123456789'
    }
  ]
  const { getByText, container } = render(
    <ApolloProvider client={createClient()}>
      <Nodes nodes={nodes} />
    </ApolloProvider>
  )

  expect(getByText('vitalik.eth', { exact: false })).toHaveTextContent(
    'vitalik.eth - 0x123456789'
  )
})

test('check NodesContainer renders items and can call for subdomains', async () => {
  const getSubdomains = jest.fn()
  const resolverOverwrites = {
    Mutation: () => ({
      getSubdomains
    }),
    Query: () => ({
      nodes: () => {
        return [
          {
            name: 'vitalik.eth',
            label: 'vitalik',
            owner: '0x123456789',
            resolver: '0x123',
            addr: '0x54321',
            content: '0x12314',
            __typename: 'Node'
          },
          {
            name: 'microsoft.eth',
            label: 'microsoft',
            owner: '0x123456789',
            resolver: '0x123',
            addr: '0x54321',
            content: '0x12314',
            __typename: 'Node'
          }
        ]
      }
    })
  }

  const { getByText, container } = render(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <NodesContainer />
    </ApolloProvider>
  )

  await waitForElement(() => getByText('Loading', { exact: false }))

  const element = await waitForElement(() =>
    getByText('vitalik.eth', { exact: false })
  )
  expect(element).toHaveTextContent('vitalik.eth - 0x123456789')

  const button = getByText('subdomains', { exact: false })
  Simulate.click(button)

  expect(getSubdomains).toHaveBeenCalledTimes(1)
})

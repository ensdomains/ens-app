import React from 'react'
import { Nodes } from '../Nodes'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import { render } from 'react-testing-library'
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

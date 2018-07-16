import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import SearchContainer, { parseSearchTerm } from '../Search'

afterEach(cleanup)

describe('parseSearchTerm', () => {
  expect(parseSearchTerm('something.eth')).toBe('name')
})

test('should call resolver without blowing up', () => {
  const getDomainAvailability = jest.fn()
  const resolverOverwrites = {
    Mutation: () => ({
      getDomainAvailability
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <SearchContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  Simulate.change(input)
  submitButton.click()
  expect(getDomainAvailability).toHaveBeenCalledTimes(1)
})

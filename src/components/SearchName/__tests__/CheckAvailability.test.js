import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import CheckAvailabilityContainer from '../CheckAvailability'

afterEach(cleanup)

test('should call resolver without blowing up', () => {
  const getDomainState = jest.fn()
  const resolverOverwrites = {
    Mutation: () => ({
      getDomainState
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  Simulate.change(input)
  submitButton.click()
  expect(getDomainState).toHaveBeenCalledTimes(1)
})

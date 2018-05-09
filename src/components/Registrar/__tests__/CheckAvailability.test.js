import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'

import createClient from '../../../testing-utils/mockedClient'

import { CheckAvailability } from '../CheckAvailability'
import CheckAvailabilityContainer from '../CheckAvailability'

afterEach(cleanup)

// test('Test CheckAvailability renders', () => {
//   render(<CheckAvailability />)
// })

// test('should call handler on submit', () => {
//   const searchDomainMock = jest.fn()
//   const { getByText, container } = renderIntoDocument(
//     <CheckAvailability searchDomain={searchDomainMock} />
//   )

//   const submitButton = getByText('Check Availability')
//   console.log(submitButton)
//   const form = container.querySelector('form')

//   submitButton.click()

//   expect(searchDomainMock).toHaveBeenCalledTimes(1)
// })

test('should call resolver without blowing up', () => {
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient()}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  Simulate.change(input)
  submitButton.click()
})

test('should call resolver without blowing up', () => {
  const resolverOverwrites = {
    Mutation: () => ({
      getDomainState(_, { name }) {
        return {
          name: 'another.eth'
        }
      }
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
})

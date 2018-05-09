import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'

import client from '../../../testing-utils/mockedClient'

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

test('should call resolver', () => {
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={client}>
      <CheckAvailabilityContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  Simulate.change(input)
  submitButton.click()

  // first is loading
  // const tree = component.toJSON()
  // expect(tree.children[0].children[0]).toMatch('loading ...')
  // expect(tree).toMatchSnapshot()

  // // wait until data arrive
  // setTimeout(() => {
  //   try {
  //     const tree2 = component.toJSON()
  //     expect(tree2.children[0].children).toMatchObject(['got data ... '])
  //     expect(tree2).toMatchSnapshot()
  //   } catch (e) {
  //     return done.fail(e)
  //   }
  //   return done()
  // }, 2500)
})

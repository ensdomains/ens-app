import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { CheckAvailability } from '../CheckAvailability'

afterEach(cleanup)

test('Test CheckAvailability renders', () => {
  render(<CheckAvailability />)
})

test('Test CheckAvailability calls handler on submit', () => {
  const searchDomainMock = jest.fn()
  const { getByText, container } = renderIntoDocument(
    <CheckAvailability searchDomain={searchDomainMock} />
  )

  const submitButton = getByText('Check')
  const form = container.querySelector('form')

  submitButton.click()

  expect(searchDomainMock).toHaveBeenCalledTimes(1)
})

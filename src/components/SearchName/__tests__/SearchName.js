import React from 'react'
import { SearchName } from '../SearchName'

import {
  renderIntoDocument,
  Simulate,
  cleanup,
  render
} from 'react-testing-library'
import 'dom-testing-library/extend-expect'

afterEach(cleanup)

test('check searchName renders', () => {
  renderIntoDocument(<SearchName />)
})

test('searchName submits proper domain', () => {
  //arrange
  const handleGetNodeDetails = jest.fn()
  const { getByText, getByTestId, container, unmount } = renderIntoDocument(
    <SearchName handleGetNodeDetails={handleGetNodeDetails} />
  )

  const form = container.querySelector('form')
  const submitButton = getByText('Search for domain')
  const domain = form.querySelector('input[type=text]')

  //act
  domain.value = 'vitalik.eth'
  Simulate.change(domain)
  Simulate.submit(submitButton)

  //assert
  expect(handleGetNodeDetails).toHaveBeenCalledTimes(1)
  expect(handleGetNodeDetails).toHaveBeenCalledWith('vitalik.eth')
  expect(submitButton.type).toBe('submit')
  expect(domain.value).toBe('')
})

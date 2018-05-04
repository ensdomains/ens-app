import React from 'react'
import { SearchName } from '../SearchName'

import {
  renderIntoDocument,
  Simulate,
  cleanup,
  render,
  fireEvent
} from 'react-testing-library'
import 'dom-testing-library/extend-expect'
import { NotificationsProvider } from '../../../Notifications'

afterEach(cleanup)

test('check searchName renders', () => {
  renderIntoDocument(
    <NotificationsProvider>
      <SearchName />
    </NotificationsProvider>
  )
})

test('searchName submits proper domain', () => {
  //arrange
  const handleGetNodeDetails = jest.fn()
  const mockClient = {
    mutate: jest.fn()
  }
  const { getByText, container } = renderIntoDocument(
    <NotificationsProvider>
      <SearchName
        handleGetNodeDetails={handleGetNodeDetails}
        client={mockClient}
      />
    </NotificationsProvider>
  )

  const form = container.querySelector('form')
  const submitButton = getByText('Search for domain')
  const domainName = form.querySelector('input[type=text]')

  //act
  domainName.value = 'vitalik.eth'
  Simulate.change(domainName)
  submitButton.click()

  //assert
  expect(handleGetNodeDetails).toHaveBeenCalledTimes(1)
  //expect(handleGetNodeDetails).toHaveBeenCalledWith('vitalik.eth', mockClient, addNotification)
  expect(submitButton.type).toBe('submit')
  expect(domainName.value).toBe('')
})

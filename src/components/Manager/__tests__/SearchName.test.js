import React from 'react'
import { SearchName, handleGetNodeDetails } from '../SearchName'

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
  const handleGetNodeDetailsMock = jest.fn()
  const mockClient = {
    mutate: jest.fn()
  }
  const { getByText, container } = renderIntoDocument(
    <NotificationsProvider>
      <SearchName
        handleGetNodeDetails={handleGetNodeDetailsMock}
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
  expect(handleGetNodeDetailsMock).toHaveBeenCalledTimes(1)
  //expect(handleGetNodeDetails).toHaveBeenCalledWith('vitalik.eth', mockClient, addNotification)
  expect(submitButton.type).toBe('submit')
  expect(domainName.value).toBe('')
})

test('test HandleGetNodeDetails handler function', () => {
  const mockData = {
    data: {
      addNode: {
        name: 'vitalik.eth'
      }
    }
  }
  const mockClient = {
    mutate() {
      return {
        then(callback) {
          callback(mockData)
        }
      }
    }
  }
  const addNotificationMock = jest.fn()

  handleGetNodeDetails('vitalik.eth', mockClient, addNotificationMock)

  expect(addNotificationMock).toHaveBeenCalledTimes(1)
  expect(addNotificationMock).toHaveBeenCalledWith({
    message: `Node details set for vitalik.eth`
  })
})

test('test HandleGetNodeDetails handler function with null returned', () => {
  const mockData = {
    data: {
      addNode: null
    }
  }
  const mockClient = {
    mutate() {
      return {
        then(callback) {
          callback(mockData)
        }
      }
    }
  }
  const addNotificationMock = jest.fn()

  handleGetNodeDetails('vitalik.eth', mockClient, addNotificationMock)

  expect(addNotificationMock).toHaveBeenCalledTimes(1)
  expect(addNotificationMock).toHaveBeenCalledWith({
    message: `vitalik.eth does not have an owner!`
  })
})

import React from 'react'
import NotificationsContext, { NotificationsProvider } from './Notifications'

import {
  renderIntoDocument,
  Simulate,
  cleanup,
  render,
  fireEvent
} from 'react-testing-library'
import 'dom-testing-library/extend-expect'

afterEach(cleanup)

test('Test notifications provider adds a notification', () => {
  const tree = (
    <NotificationsProvider>
      <NotificationsContext>
        {({ addNotification }) => (
          <div
            onClick={() => {
              addNotification({
                message: 'some important message',
                level: 'success'
              })
            }}
          >
            Add Notification
          </div>
        )}
      </NotificationsContext>
    </NotificationsProvider>
  )
  const { getByText, container } = render(tree)

  const button = getByText('Add Notification')

  Simulate.click(button)

  expect(getByText('some important message')).toHaveTextContent(
    'some important message'
  )
})

// test('searchName submits proper domain', () => {
//   //arrange
//   const handleGetNodeDetails = jest.fn()
//   const { getByText, container } = renderIntoDocument(
//     <SearchName handleGetNodeDetails={handleGetNodeDetails} />
//   )

//   const form = container.querySelector('form')
//   const submitButton = getByText('Search for domain')
//   const domainName = form.querySelector('input[type=text]')

//   //act
//   domainName.value = 'vitalik.eth'
//   Simulate.change(domainName)
//   submitButton.click()

//   //assert
//   expect(handleGetNodeDetails).toHaveBeenCalledTimes(1)
//   expect(handleGetNodeDetails).toHaveBeenCalledWith('vitalik.eth')
//   expect(submitButton.type).toBe('submit')
//   expect(domainName.value).toBe('')
// })

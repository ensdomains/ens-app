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

test('Renders without provider', () => {
  const trackerFunc = jest.fn()
  const tree = (
    <NotificationsContext>
      {({ addNotification }) => (
        <div
          onClick={() => {
            addNotification()
            trackerFunc()
          }}
        >
          Add Notification
        </div>
      )}
    </NotificationsContext>
  )
  const { getByText, container } = render(tree)

  const button = getByText('Add Notification')

  Simulate.click(button)
  expect(trackerFunc).toHaveBeenCalledTimes(1)
})

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

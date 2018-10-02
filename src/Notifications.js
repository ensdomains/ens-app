import React, { Component } from 'react'
import NotificationSystem from 'react-notification-system'

const GlobalState = React.createContext({
  addNotification: () => {}
})

export default GlobalState

export class NotificationsProvider extends Component {
  constructor(props) {
    super(props)
    this._notificationSystem = React.createRef()
  }

  addNotification = ({ level = 'success', message }) => {
    if (!message) {
      throw new Error('message required for notification')
    }
    this._notificationSystem.current.addNotification({
      message,
      level
    })
  }

  state = {
    addNotification: this.addNotification
  }

  render() {
    return (
      <GlobalState.Provider value={this.state}>
        <NotificationSystem ref={this._notificationSystem} />
        {this.props.children}
      </GlobalState.Provider>
    )
  }
}

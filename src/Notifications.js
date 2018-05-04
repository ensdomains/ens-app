import React, { Fragment, Component } from 'react'
import NotificationSystem from 'react-notification-system'

const GlobalState = React.createContext()

export default GlobalState

export class NotificationsProvider extends Component {
  state = {
    showModal: false,
    modal: ''
  }

  constructor(props) {
    super(props)
    this._notificationSystem = React.createRef()
    console.log(this._notificationSystem)
  }

  addNotification = () => {
    //console.log(this._notificationSystem)
    this._notificationSystem.current.addNotification({
      message: 'Notification message',
      level: 'success'
    })
  }

  render() {
    return (
      <GlobalState.Provider
        value={{
          state: this.state,
          addNotification: this.addNotification
        }}
      >
        <NotificationSystem ref={this._notificationSystem} />
        {this.props.children}
      </GlobalState.Provider>
    )
  }
}

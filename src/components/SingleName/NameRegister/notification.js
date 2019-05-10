import 'notification-polyfill'

export function sendNotification(message = 'Hi there') {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    return false
  }

  // Let's check whether notification permissions have already been granted
  else if (hasPermission()) {
    // If it's okay let's create a notification
    new Notification(message)
  }
}

export function hasPermission() {
  return Notification.permission === 'granted'
}

export function requestPermission() {
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        sendNotification(
          'We will send you a notification when your name is ready'
        )
      }
    })
  }
}

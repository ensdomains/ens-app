export function sendNotification(message = 'Hi there') {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    return false
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    var notification = new Notification(message)
  }
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

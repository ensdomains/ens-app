export function sendNotification() {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    return false
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    var notification = new Notification('Hi there!')
  }
}

export function requestPermission() {
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        var notification = new Notification(
          "we'll notify you when your name is ready to register!"
        )
      }
    })
  }
}

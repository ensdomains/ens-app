import React from 'react'
import AddToCalendar from 'react-add-to-calendar'

function CalendarInvite(
  startTime = '2016-09-16T20:15:00-04:00',
  endTime = '2016-09-16T21:45:00-04:00',
  type = '',
  name
) {
  const cal = {
    event: {
      title: `Renew your ENS domain ${name}`,
      description: 'Your ENS name is expiring soon, please renew it',
      location: 'Everywhere',
      startTime,
      endTime
    }
  }
  return <AddToCalendar event={cal.event} />
}

export default CalendarInvite

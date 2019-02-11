import React from 'react'
import AddToCalendar from 'react-add-to-calendar'

function CalendarInvite(
  startTime = '2016-09-16T20:15:00-04:00',
  endTime = '2016-09-16T21:45:00-04:00'
) {
  const cal = {
    event: {
      title: 'Register domain',
      description: 'This is the sample event provided as an example only',
      location: 'Portland, OR',
      startTime,
      endTime
    }
  }
  return <AddToCalendar event={cal} />
}

export default CalendarInvite

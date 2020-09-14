import React from 'react'
import Calendar, { CalendarButton } from './Calendar'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

function RenewalCalendarInvite({ startDatetime, name, noMargin, invalid }) {
  const { t } = useTranslation()
  const endDatetime = startDatetime.clone().add(2, 'hours')
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours()
  const event = {
    title: t('reminder.release.title', { name }),
    description: t('reminder.release.description', { name }),
    location: t('reminder.everywhere'),
    startDatetime: startDatetime.format('YYYYMMDDTHHmmss'),
    endDatetime: endDatetime.format('YYYYMMDDTHHmmss'),
    duration
  }
  return <Calendar event={event} noMargin={noMargin} invalid={invalid} />
}

export default RenewalCalendarInvite

export { CalendarButton }

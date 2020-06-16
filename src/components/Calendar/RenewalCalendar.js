import React from 'react'
import Calendar, { CalendarButton } from './Calendar'
import EmailNotifyLink from '../ExpiryNotification/EmailNotifyLink'
import AddToCalendarHOC from 'react-add-to-calendar-hoc'
import Dropdown from './Dropdown'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

function RenewalCalendarInvite({
  startDatetime,
  type = '',
  name,
  registrant,
  noMargin
}) {
  const { t } = useTranslation()
  const endDatetime = startDatetime.clone().add(2, 'hours')
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours()
  const event = {
    title: `Renew your ENS domain ${name}`,
    description: 'Your ENS name is expiring soon, please renew it',
    location: 'Everywhere',
    startDatetime: startDatetime.format('YYYYMMDDTHHmmss'),
    endDatetime: endDatetime.format('YYYYMMDDTHHmmss'),
    duration
  }

  // AddToCalendarHOC does not allow passing in additional arbitary links
  // to render in the dropdown list. Instead of refactoring the external
  // library, the Dropdown component was extend to support rendering
  // additional elements from appendChildren & prependChildren props.
  const dropDownLinks = [
    <EmailNotifyLink key="email" domainName={name} address={registrant}>
      {t('c.email')}
    </EmailNotifyLink>
  ]

  return (
    <Calendar event={event} dropDownLinks={dropDownLinks} noMargin={noMargin} />
  )
}

export default RenewalCalendarInvite

export { CalendarButton }

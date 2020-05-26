import React from 'react'
import AddToCalendarHOC from 'react-add-to-calendar-hoc'
import Dropdown from './Dropdown'
import DefaultButton from '../Forms/Button'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { css } from 'emotion'
import calendar from '../../assets/calendar.svg'
import EmailNotifyLink from '../ExpiryNotification/EmailNotifyLink'

const Button = styled(DefaultButton)`
  border: none;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    border: none;
  }
`

const CalendarButton = props => (
  <Button type="hollow-primary" {...props}>
    <img src={calendar} alt="calendar icon" />
    &nbsp;
    {props.children}
  </Button>
)

function CalendarInvite({
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

  const styles = css`
    position: relative;
    margin-right: 10px;
    ${noMargin
      ? `
      margin: 0;
    `
      : ''}
  `

  // AddToCalendarHOC does not allow passing in additional arbitary links
  // to render in the dropdown list. Instead of refactoring the external
  // library, the Dropdown component was extend to support rendering
  // additional elements from appendChildren & prependChildren props.
  const expiryNotificationLink = (
    <EmailNotifyLink key="email" domainName={name} address={registrant}>
      {t('c.email')}
    </EmailNotifyLink>
  )

  const AddToCalendar = AddToCalendarHOC(CalendarButton, Dropdown)
  return (
    <AddToCalendar
      event={event}
      className={styles}
      buttonText={t('expiry.reminder')}
      items={['Google', 'iCal']}
      dropdownProps={{
        prependChildren: [expiryNotificationLink]
      }}
    />
  )
}

export default CalendarInvite

export { CalendarButton }

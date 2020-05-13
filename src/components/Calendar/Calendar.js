import React from 'react'
import AddToCalendarHOC from 'react-add-to-calendar-hoc'
import Dropdown from './Dropdown'
import DefaultButton from '../Forms/Button'
import moment from 'moment'
import styled from '@emotion/styled'
import { css } from 'emotion'
import calendar from '../../assets/calendar.svg'

const Button = styled(DefaultButton)`
  border: none;
  display: flex;
  align-items: center;

  &:hover {
    border: none;
  }
`

const CalendarButton = props => (
  <Button type="hollow-primary" {...props}>
    <img src={calendar} />
    &nbsp;
    {props.children}
  </Button>
)

function CalendarInvite({ startDatetime, type = '', name, noMargin }) {
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
    ${noMargin ? 'margin: 0;' : ''}
  `

  const AddToCalendar = AddToCalendarHOC(CalendarButton, Dropdown)
  return (
    <AddToCalendar
      event={event}
      className={styles}
      buttonText="Set renewal reminder"
      items={['Google', 'iCal']}
    />
  )
}

export default CalendarInvite

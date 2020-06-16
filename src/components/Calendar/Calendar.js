import React from 'react'
import AddToCalendarHOC from 'react-add-to-calendar-hoc'
import Dropdown from './Dropdown'
import DefaultButton from '../Forms/Button'
import styled from '@emotion/styled/macro'
import { css } from 'emotion'
import { useTranslation } from 'react-i18next'
import calendar from '../../assets/calendar.svg'

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

function CalendarInvite({ noMargin, dropDownLinks = [], event }) {
  const { t } = useTranslation()

  const styles = css`
    position: relative;
    margin-right: 10px;
    ${noMargin
      ? `
      margin: 0;
    `
      : ''}
  `

  const AddToCalendar = AddToCalendarHOC(CalendarButton, Dropdown)
  return (
    <AddToCalendar
      event={event}
      className={styles}
      buttonText={t('expiryNotification.reminder')}
      items={['Google', 'iCal']}
      dropdownProps={{
        prependChildren: dropDownLinks
      }}
    />
  )
}

export default CalendarInvite

export { CalendarButton }

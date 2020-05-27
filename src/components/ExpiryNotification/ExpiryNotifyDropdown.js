import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { CalendarButton } from '../Calendar/Calendar'
import Dropdown from '../Calendar/Dropdown'
import EmailNotifyLink from './EmailNotifyLink'

const ExpiryNotifyDropdownContainer = styled('div')`
  position: relative;
`

export default function ExpiryNotifyDropdown({ address }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const { t } = useTranslation()

  const handleClick = e => {
    setShowDropdown(show => !show)
  }

  return (
    <ExpiryNotifyDropdownContainer>
      <CalendarButton onClick={handleClick}>
        {t('expiryNotification.reminder')}
      </CalendarButton>
      {showDropdown && (
        <Dropdown>
          <EmailNotifyLink onClick={handleClick} key="email" address={address}>
            {t('c.email')}
          </EmailNotifyLink>
        </Dropdown>
      )}
    </ExpiryNotifyDropdownContainer>
  )
}

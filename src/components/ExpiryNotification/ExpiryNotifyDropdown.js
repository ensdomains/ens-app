import React, { createRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { CalendarButton } from '../Calendar/Calendar'
import Dropdown from '../Calendar/Dropdown'
import EmailNotifyLink from './EmailNotifyLink'
import Modal from '../Modal/Modal'
import ExpiryNotificationModal from './ExpiryNotificationModal'
import { useOnClickOutside } from 'components/hooks'
import { EPNSLink, EPNSNotificationModal } from '../EPNS'

const ExpiryNotifyDropdownContainer = styled('div')`
  position: relative;
`

const customDropdownStyles = { minWidth: 162, gap: '10px' }

export default function ExpiryNotifyDropdown({ address }) {
  const dropdownRef = createRef()
  const togglerRef = createRef()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [optionSelected, setOptionSelected] = useState(false)
  const { t } = useTranslation()

  useOnClickOutside([dropdownRef, togglerRef], () => setShowDropdown(false))

  const handleDropdownClick = () => {
    setShowDropdown(value => !value)
  }

  const handleEmailNotifyClick = () => {
    setOptionSelected('email')
    setShowModal(true)
    setShowDropdown(false)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setOptionSelected('')
  }

  const handleEPNSNotifyClick = () => {
    setOptionSelected('epns')
    setShowModal(true)
    setShowDropdown(false)
  }

  return (
    <ExpiryNotifyDropdownContainer>
      <CalendarButton ref={togglerRef} onClick={handleDropdownClick}>
        {t('expiryNotification.reminder')}
      </CalendarButton>
      {showDropdown && (
        <Dropdown ref={dropdownRef} style={customDropdownStyles}>
          <EmailNotifyLink
            onClick={handleEmailNotifyClick}
            key="email"
            address={address}
          >
            {t('c.email')}
          </EmailNotifyLink>

          <EPNSLink key="epns" onClick={handleEPNSNotifyClick}>
            {t('epns.link')}
          </EPNSLink>
        </Dropdown>
      )}
      {showModal && optionSelected === 'email' && (
        <Modal closeModal={handleCloseModal}>
          <ExpiryNotificationModal
            {...{ address, onCancel: handleCloseModal }}
          />
        </Modal>
      )}

      {showModal && optionSelected === 'epns' && (
        <Modal closeModal={handleCloseModal}>
          <EPNSNotificationModal {...{ address, onCancel: handleCloseModal }} />
        </Modal>
      )}
    </ExpiryNotifyDropdownContainer>
  )
}

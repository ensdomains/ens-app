import React, { useState } from 'react'
import Calendar, { CalendarButton } from './Calendar'
import EmailNotifyLink from '../ExpiryNotification/EmailNotifyLink'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal/Modal'
import ExpiryNotificationModal from '../ExpiryNotification/ExpiryNotificationModal'

function RenewalCalendarInvite({
  startDatetime,
  type = '',
  name,
  registrant,
  noMargin
}) {
  const [showModal, setShowModal] = useState(false)

  const { t } = useTranslation()
  const endDatetime = startDatetime.clone().add(2, 'hours')
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours()
  const event = {
    title: t('reminder.renewal.title', { name }),
    description: t('reminder.renewal.description'),
    location: t('reminder.everywhere'),
    startDatetime: startDatetime.format('YYYYMMDDTHHmmss'),
    endDatetime: endDatetime.format('YYYYMMDDTHHmmss'),
    duration
  }

  const handleEmailNotifyClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // AddToCalendarHOC does not allow passing in additional arbitrary links
  // to render in the dropdown list. Instead of refactoring the external
  // library, the Dropdown component was extend to support rendering
  // additional elements from appendChildren & prependChildren props.
  const dropDownLinks = [
    <EmailNotifyLink
      key="email"
      domainName={name}
      address={registrant}
      onClick={handleEmailNotifyClick}
    >
      {t('c.email')}
    </EmailNotifyLink>
  ]

  return (
    <>
      {showModal && (
        <Modal closeModal={handleCloseModal}>
          <ExpiryNotificationModal
            {...{ address: registrant, onCancel: handleCloseModal }}
          />
        </Modal>
      )}
      <Calendar
        event={event}
        dropDownLinks={dropDownLinks}
        noMargin={noMargin}
      />
    </>
  )
}

export default RenewalCalendarInvite

export { CalendarButton }

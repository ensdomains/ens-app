import styled from '@emotion/styled'
import { css } from 'emotion'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { EmailComponent } from '@buidlhub/buidlhub-ens-notifications'

import {
  default as Button,
  getButtonDefaultStyles,
  getButtonStyles
} from '../Forms/Button'
import GlobalState from '../../globalState'
import Loader from '../Loader'
import Modal from '../Modal/Modal'
import mq from 'mediaQuery'
import { ReactComponent as Email } from '../Icons/Email.svg'
import TruncatedAddress from './TruncatedAddress'

const BUILDHUB_LINK =
  'https://buidlhub.com/?utm_source=ens&utm_medium=link&utm_campaign=reminder'
const EXPIRY_NOTIFICATION_MODAL_NAME = 'buidlhub-expiry-notification'
const INPUT_NAME = 'buidlhub-email-input'

// Custom components to match styling & use media queries
const LoadingComponent = styled(Loader)`
  display: inline-block;
  margin: 0 10px;
`

const ModalIconContainer = styled('div')`
  display: none;
  justify-self: end;
  ${mq.xLarge`
    display: block;
  `}
`

const FormComponent = styled('form')`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  ${mq.xLarge`
    grid-template-columns: 2fr 1fr;
  `}
`

const LabelComponent = ({ address, name }) => {
  return (
    <>
      <div
        className={css`
          font-weight: 200;
        `}
      >
        <a href={BUILDHUB_LINK} target="_blank" rel="noopener noreferrer">
          BUIDLHub
        </a>{' '}
        checks if address <TruncatedAddress address={address} /> has expiring
        names within 30 days and sends you a reminder email every week.
        <label
          htmlFor={name}
          className={css`
            display: block;
            margin-top: 20px;
          `}
        >
          Enter email to receive email notifications.
        </label>
      </div>
      <ModalIconContainer>
        <Email />
      </ModalIconContainer>
    </>
  )
}

const buttonStyles = `
  margin: 5px;
  position: relative;
  float: right;
`

const CancelComponent = styled(Button)`
  ${getButtonDefaultStyles()}
  ${getButtonStyles({ type: 'hollow' })}
  ${buttonStyles}
 `

const SubmitComponent = styled(Button)`
    ${getButtonDefaultStyles()}
    ${getButtonStyles({ type: 'primary' })}
    ${buttonStyles}
`

const ExpiryNotificationModal = () => {
  const { toggleModal, currentModal } = useContext(GlobalState)
  const { t } = useTranslation()

  const address = currentModal ? currentModal.address : null

  // Passing a references domain name may be useful for future capabilities, if a
  // user wants to monitor ENS names owned by others for upcoming expiration. This
  // feature would require additional planning / coordination between ENS <> BUIDLHub.

  // const domainName = currentModal ?
  //   currentModal.domainName :
  //   null;

  const translation = {
    cancel: t(`c.cancel`),
    submit: t(`c.save`),
    close: 'Close',
    placeholder: 'Enter Email address',
    registerSuccess:
      'Please check your inbox to verify your email address. You will be redirected to BUIDLHub to manage your email notifications.'
  }

  return (
    <Modal name={EXPIRY_NOTIFICATION_MODAL_NAME}>
      <EmailComponent
        cancelComponent={CancelComponent}
        // domainName={domainName}
        formComponent={FormComponent}
        labelComponent={LabelComponent}
        loadingComponent={LoadingComponent}
        name={INPUT_NAME}
        onCancel={() => toggleModal({ name: EXPIRY_NOTIFICATION_MODAL_NAME })}
        publicAddress={address}
        submitComponent={SubmitComponent}
        translation={translation}
      />
    </Modal>
  )
}

export { EXPIRY_NOTIFICATION_MODAL_NAME }

export default ExpiryNotificationModal

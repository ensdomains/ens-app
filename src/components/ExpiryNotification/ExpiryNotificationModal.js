import styled from '@emotion/styled'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { EmailComponent } from '@buidlhub/buidlhub-ens-notifications'

import {
  default as Button,
  getButtonDefaultStyles,
  getButtonStyles
} from '../Forms/Button'
import Loader from '../Loader'
import mq from 'mediaQuery'
import { ReactComponent as Email } from '../Icons/Email.svg'
import TruncatedAddress from './TruncatedAddress'

/**
 * This file encapsulates the majority of the BUIDLHub
 * email notification feature introduced to ens-app.
 *
 * The following collection of styled components are
 * designed to be passed into the EmailComponent provided
 * by the @buidlhub/buidlhub-ens-notifications package.
 *
 * The approach of constructing a series of styled components
 * that are passed into the EmailComponent HOC was taken to
 * provided flexibility in adjusting the style / behavior
 * of this feature as needed.
 *
 */

const BUILDHUB_LINK =
  'https://buidlhub.com/?utm_source=ens&utm_medium=link&utm_campaign=reminder'
const EXPIRY_NOTIFICATION_MODAL_NAME = 'buidlhub-expiry-notification'
const INPUT_NAME = 'buidlhub-email-input'

// Custom components to match styling & use media queries
const ActionsContainerComponent = styled('div')`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const EmailInputComponent = styled('input')`
  border-radius: 8px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 4px 0 rgba(181, 177, 177, 0.5);
  height: 42px;
  margin: auto 0;
  padding: 5px 10px;
  width: auto;
`

const LoadingComponent = styled(Loader)`
  display: inline-block;
  margin: 0 10px;
`

const ModalIconContainer = styled('div')`
  display: none;
  justify-self: end;
  margin-top: -10px;
  ${mq.xLarge`
    display: block;
  `}
`

const MessageContainer = props => (
  <>
    <div className={props.className}>{props.children}</div>

    <ModalIconContainer>
      <Email />
    </ModalIconContainer>
  </>
)

const FormComponent = styled('form')`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  font-weight: 200;
  ${mq.xLarge`
    grid-template-columns: 2fr 1fr;
  `}
`

const FormLabel = styled('label')`
  display: block;
  margin-top: 20px;
`

const LabelComponent = ({ address, name }) => {
  return (
    <>
      <div>
        <a href={BUILDHUB_LINK} target="_blank" rel="noopener noreferrer">
          BUIDLHub
        </a>{' '}
        checks if address <TruncatedAddress address={address} /> has expiring
        names within 30 days and sends you a reminder email every week.
        <FormLabel htmlFor={name}>
          Enter email to receive email notifications.
        </FormLabel>
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

const ExpiryNotificationModal = ({ address, onCancel }) => {
  const { t } = useTranslation()

  // Passing a references domain name may be useful for future capabilities, if a
  // user wants to monitor ANS names owned by others for upcoming expiration. This
  // feature would require additional planning / coordination between ANS <> BUIDLHub.
  // const domainName = currentModal ?
  //   currentModal.domainName :
  //   null;

  const translation = {
    cancel: t('c.cancel'),
    submit: t('c.save'),
    placeholder: t('expiryNotification.placeholder'),
    registerSuccess:
      'Please check your inbox to verify your email address. You will be redirected to BUIDLHub to manage your email notifications.'
  }

  return (
    <EmailComponent
      ActionsContainerComponent={ActionsContainerComponent}
      cancelComponent={CancelComponent}
      emailInputComponent={EmailInputComponent}
      formComponent={FormComponent}
      labelComponent={LabelComponent}
      loadingComponent={LoadingComponent}
      messageContainerComponent={MessageContainer}
      name={INPUT_NAME}
      onCancel={onCancel}
      publicAddress={address}
      submitComponent={SubmitComponent}
      translation={translation}
    />
  )
}

export default ExpiryNotificationModal

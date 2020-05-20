import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'

import {
  DetailsItem,
  DetailsKey,
  DetailsContent
} from '../SingleName/DetailsItem'

import { useEditable } from '../hooks'
import Button, {
  getButtonDefaultStyles,
  getButtonStyles
} from '../Forms/Button'
import Loader from '../Loader'

import { EmailComponent } from '@buidlhub/buidlhub-ens-notifications'

const EmailNotifyButton = styled(Button)`
  margin-right: 20px;
  align-self: flex-start;
  width: 200px;
`

const ExpiryNotificationContainer = styled(DetailsItem)`
  grid-column: 1/3;
  background: ${({ editing, backgroundStyle }) => {
    switch (backgroundStyle) {
      case 'warning':
        return editing ? 'transparent' : 'transparent'
      default:
        return editing ? '#F0F6FA' : 'transparent'
    }
  }};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  ${({ editing }) => (editing ? `margin-bottom: 20px;` : '')}
  transition: 0.3s;

  ${({ editing }) => editing && mq.small` flex-direction: column;`};

  > div {
    width: 100%;
  }
`

const ExpiryNotificationItemEditable = ({ address }) => {
  const { t, i18n } = useTranslation()
  const { state, actions } = useEditable()

  const { editing } = state

  const { startEditing, stopEditing } = actions

  const loading = <Loader />

  const Buttons = styled('div')`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  `

  const submitStyle = [
    getButtonDefaultStyles(),
    getButtonStyles({ type: 'primary' }),
    `
    position: relative;
    float: right;
    `
  ].join('\n')

  const cancelStyle = [
    getButtonDefaultStyles(),
    getButtonStyles({ type: 'hollow' }),
    `  
    position: relative;
    float: right;
    `
  ].join('\n')

  return (
    <>
      {!editing && (
        <EmailNotifyButton type="hollow-primary" onClick={startEditing}>
          {t('expiry.notify')}
        </EmailNotifyButton>
      )}

      {editing && (
        <ExpiryNotificationContainer backgroundStyle="blue" editing={editing}>
          <EmailComponent
            labelContainer={DetailsItem}
            actionsContainer={Buttons}
            messageContainer={DetailsKey}
            emailInputStyle="width: 100%; margin: 1em 0;"
            onCancel={stopEditing}
            cancelStyle={cancelStyle}
            language={i18n.lng}
            loading={loading}
            publicAddress={address}
            submitStyle={submitStyle}
          />
        </ExpiryNotificationContainer>
      )}
    </>
  )
}

function ExpiryNotificationItemViewOnly({
  keyName,
  value,
  type,
  domain,
  account
}) {
  return ''
}

function ExpiryNotificationItem(props) {
  const { canEdit } = props
  if (canEdit) return <ExpiryNotificationItemEditable {...props} />
  return <ExpiryNotificationItemViewOnly {...props} />
}

ExpiryNotificationItem.propTypes = {
  address: PropTypes.string.isRequired, //
  canEdit: PropTypes.bool.isRequired //
}

export default ExpiryNotificationItem

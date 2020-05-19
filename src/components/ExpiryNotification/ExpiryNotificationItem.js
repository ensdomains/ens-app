import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'

import {
  DetailsItem,
  DetailsKey,
  DetailsValue,
  DetailsContent
} from '../SingleName/DetailsItem'

import { useEditable } from '../hooks'
import Button, {
  getButtonDefaultStyles,
  getButtonStyles
} from '../Forms/Button'
import Loader from '../Loader'

import {
  BuidlhubEnsClient,
  EmailComponent
} from '@buidlhub/buidlhub-ens-notifications'

const buidlhub = new BuidlhubEnsClient()

const EmailNotifyButton = styled(Button)``

const ExpiryNotificationItemEditable = ({ address }) => {
  const { t, i18n } = useTranslation()
  const { state, actions } = useEditable()

  const { editing } = state

  const { startEditing, stopEditing } = actions

  const loading = <Loader />

  const submitStyle = [
    getButtonDefaultStyles(),
    getButtonStyles({ type: 'primary' })
  ].join('\n')

  const cancelStyle = [
    getButtonDefaultStyles(),
    getButtonStyles({ type: 'hollow' })
  ].join('\n')

  return (
    <>
      {!editing && (
        <EmailNotifyButton type="hollow-primary" onClick={startEditing}>
          {t('expiry.notify')}
        </EmailNotifyButton>
      )}

      {editing && (
        <>
          <EmailComponent
            labelContainer={DetailsItem}
            actionsContainer={DetailsContent}
            messageContainer={DetailsKey}
            emailInputStyle="width: 100%;"
            onCancel={stopEditing}
            cancelStyle={cancelStyle}
            buidlhub={buidlhub}
            language={i18n.lng}
            loading={loading}
            publicAddress={address}
            submitStyle={submitStyle}
          />
        </>
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

import React, { useContext } from 'react'
import GlobalState from '../../globalState'

import { EXPIRY_NOTIFICATION_MODAL_NAME } from './ExpiryNotificationModal'

const EmailNotifyLink = ({ address, domainName, children, onClick = null }) => {
  const { toggleModal } = useContext(GlobalState)

  const handleClick = e => {
    if (onClick) {
      onClick()
    }

    toggleModal({
      name: EXPIRY_NOTIFICATION_MODAL_NAME,
      cancel: () => {
        toggleModal({ name: EXPIRY_NOTIFICATION_MODAL_NAME })
      },
      address,
      domainName
    })
  }

  return (
    // TODO: Resolving this a11y warning the correct way requires more invasive changes to
    // global CSS and other parts of the site.
    // See: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md#case-i-want-navigable-links

    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href="#" onClick={handleClick}>
      {children}
    </a>
  )
}

export default EmailNotifyLink

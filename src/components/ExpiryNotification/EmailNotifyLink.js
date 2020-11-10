import React, { useContext } from 'react'
import GlobalState from '../../globalState'

import { EXPIRY_NOTIFICATION_MODAL_NAME } from './ExpiryNotificationModal'

// If react-add-to-calendar-hoc is replaced, it may be useful
// to switch to a button element for a11y purposes.
// const ButtonLink = styled('button')`
//   color: #5284ff;
//   text-decoration: none;
//   cursor: pointer;
//   display: inline;
//   font-family: "Overpass Mono";
//   font-size: 18px;
//   font-weight: 100;
//   text-align: start;
//   background: transparent;
//   border: none;
//   padding: 0;
//   margin: 0;
// `;

const EmailNotifyLink = ({ address, domainName, children, onClick = null }) => {
  const { toggleModal } = useContext(GlobalState)

  const handleClick = e => {
    if (onClick) {
      onClick(e)
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

    // eslint-disable-next-line
    <a href="#" onClick={handleClick}>
      {children}
    </a>
  )
}

export default EmailNotifyLink

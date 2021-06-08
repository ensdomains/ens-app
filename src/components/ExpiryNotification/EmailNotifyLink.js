import React, { useContext, useState } from 'react'
import GlobalState from '../../globalState'

import Modal from '../Modal/Modal'

import ExpiryNotificationModal from './ExpiryNotificationModal'

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

const EmailNotifyLink = ({ children, onClick = null }) => {
  const handleClick = e => {
    e.preventDefault()

    if (onClick) {
      onClick(e)
    }
  }

  return (
    // TODO: Resolving this a11y warning the correct way requires more invasive changes to
    // global CSS and other parts of the site.
    // See: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md#case-i-want-navigable-links

    <>
      <a href="#" onClick={handleClick}>
        {children}
      </a>
    </>
    // eslint-disable-next-line
  )
}

export default EmailNotifyLink

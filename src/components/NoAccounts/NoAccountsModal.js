import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import NoAccounts from './NoAccounts'

const NoAccountContainer = styled('div')`
  position: relative;
  margin-top: 5px;
`
export default ({ colour, buttonText, onClick, textColour, className }) => {
  let [showModal, setShowModal] = useState(false)
  return (
    <NoAccountContainer className={className}>
      <NoAccounts
        colour={colour}
        buttonText={buttonText}
        textColour={textColour}
        active={showModal}
        onClick={onClick}
      />
    </NoAccountContainer>
  )
}

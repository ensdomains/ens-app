import React from 'react'
import styled from '@emotion/styled/macro'

const NotAvailableContainer = styled('div')`
  padding: 30px 40px;
`

const Message = styled('div')`
  background: #f0f6fa;
  color: #2b2b2b;
  font-size: 20px;
  padding: 20px;
  font-weight: 300;
`

export default function NotAvailable({ domain }) {
  return (
    <NotAvailableContainer>
      <Message>This name is already registered</Message>
    </NotAvailableContainer>
  )
}

import React from 'react'
import styled from '@emotion/styled'

const NotAvailableContainer = styled('div')`
  padding: 30px 40px;
`

const Message = styled('div')`
  background: hsla(37, 91%, 55%, 0.1);
  color: #2b2b2b;
  font-size: 20px;
  padding: 20px;
  font-weight: 300;
`

export default function NotAvailable({ domain }) {
  return (
    <NotAvailableContainer>
      <Message>
        Registration of new .eth names is disabled while the ENS migration is
        underway. Please check back on February 10th.
      </Message>
    </NotAvailableContainer>
  )
}

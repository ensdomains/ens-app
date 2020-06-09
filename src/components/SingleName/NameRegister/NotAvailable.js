import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <NotAvailableContainer>
      <Message>{t('singleName.messages.alreadyregistered')}</Message>
    </NotAvailableContainer>
  )
}

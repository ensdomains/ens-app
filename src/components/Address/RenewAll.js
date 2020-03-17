import React from 'react'
import styled from '@emotion/styled'
import DefaultButton from '../Forms/Button'

const RenewContainer = styled('div')``

const RenewSelected = styled(DefaultButton)`
  margin-right: 20px;
`

const RenewAll = styled(DefaultButton)``

export default function Renew() {
  return (
    <RenewContainer>
      <RenewSelected type="hollow-primary">Renew Selected</RenewSelected>
      <RenewAll>Renew all</RenewAll>
    </RenewContainer>
  )
}

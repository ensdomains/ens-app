import React from 'react'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const ShortNameContainer = styled('div')`
  padding: 20px;
  text-align: center;

  ${mq.medium`
    padding: 40px 40px;
  `}
`

const InnerWrapper = styled('div')`
  background: #282929;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${mq.medium`
    flex-direction: row;
    align-items: flex-start;
  `}
  p {
    text-align: left;
    max-width: 500px;
    font-weight: 300;
    line-height: 26px;
    font-size: 18px;
    margin-top: 0;
  }
  ${mq.small`
    padding: 40px 40px;
  `}
`

export default function ShortName({ name }) {
  return (
    <ShortNameContainer>
      <InnerWrapper>1 ~ 2 characters are not allowed to register.</InnerWrapper>
    </ShortNameContainer>
  )
}

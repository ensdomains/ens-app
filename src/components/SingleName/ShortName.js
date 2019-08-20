import React from 'react'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { ExternalButtonLink } from '../Forms/Button'

const ShortNameContainer = styled('div')`
  padding: 20px;
  text-align: center;

  ${mq.medium`
    padding: 40px 40px;
  `}
`

const InnerWrapper = styled('div')`
  background: #f0f6fa;
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
  const link = `https://opensea.io/ens-landing`
  return (
    <ShortNameContainer>
      <InnerWrapper>
        <p>
          Short names auctions will start soon at <a href={link}>OpenSea</a>
        </p>
        <ExternalButtonLink href={link} type="hollow-primary-disabled">
          Bid Now
        </ExternalButtonLink>
      </InnerWrapper>
    </ShortNameContainer>
  )
}

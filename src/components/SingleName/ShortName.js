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
  background: hsla(37, 91%, 55%, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

export default function ShortName() {
  return (
    <ShortNameContainer>
      <InnerWrapper>
        <p>
          Short names are not currently on auction, but they can be reserved at{' '}
          <a href="https://reserve.ens.domains">reserve.ens.domains</a>. The
          auctions will begin soon after the reservation process.
        </p>
        <ExternalButtonLink
          href="https://reserve.ens.domains"
          type="hollow-primary"
        >
          Reserve Now
        </ExternalButtonLink>
      </InnerWrapper>
    </ShortNameContainer>
  )
}

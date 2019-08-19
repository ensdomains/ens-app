import React from 'react'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { ExternalButtonLink } from '../Forms/Button'
import jsSHA3 from 'js-sha3'

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
  const label = name.split('.')[0]
  const labelhash = `${jsSHA3.keccak256(label.toLowerCase())}`
  const link = `https://opensea.io/assets/0xFaC7BEA255a6990f749363002136aF6556b31e04/${labelhash}`
  return (
    <ShortNameContainer>
      <InnerWrapper>
        <p>
          Short names are currently on auction, but they can be reserved at{' '}
          <a href={link}>OpenSea</a>. The auctions will begin soon after the
          reservation process.
        </p>
        <ExternalButtonLink href={link} type="hollow-primary">
          Bid Now
        </ExternalButtonLink>
      </InnerWrapper>
    </ShortNameContainer>
  )
}

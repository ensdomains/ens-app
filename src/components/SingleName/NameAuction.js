import React, { Component } from 'react'
import styled from 'react-emotion'
import { H2 as DefaultH2 } from '../Typography/Basic'
import { getTimeLeft, humanizeDate } from '../../lib/utils'

const NameAuctionContainer = styled('div')`
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 40px;
`
const H2 = styled(DefaultH2)`
  color: #2b2b2b;
`
const BiddingContainer = styled('div')``
const TimePeriod = styled('p')`
  font-size: 12px;
  font-weight: 200;
`
const SmallPrintContainer = styled('p')`
  font-size: 12px;
  color: #adbbcd;
  max-width: 400px;
  font-weight: 200;
  padding-bottom: 0;
`

const RevealContainer = styled('div')``

const TimeLeft = styled('div')``

const SmallPrint = () => (
  <SmallPrintContainer>
    This version of ENS doesn’t allow you to register or bid for a domain, but
    we are working hard to update the ENS Dapp to allow you to do so.
  </SmallPrintContainer>
)

class NameAuction extends Component {
  render() {
    const { domain, timeLeft } = this.props
    const humanizedDate = humanizeDate(timeLeft)
    return (
      <NameAuctionContainer>
        {domain.state === 'Auction' ? (
          <BiddingContainer>
            <H2>Bidding Period</H2>
            <TimePeriod>
              The bid period lasts 72 hours for this domain.
            </TimePeriod>
            <SmallPrint />
            <TimeLeft>{humanizedDate}</TimeLeft>
          </BiddingContainer>
        ) : (
          <RevealContainer>
            <H2>Reveal Period</H2>
            <TimePeriod>
              The reveal period lasts 48 hours for this domain.
            </TimePeriod>
            <SmallPrint />
            <TimeLeft>{humanizedDate} left</TimeLeft>
          </RevealContainer>
        )}
      </NameAuctionContainer>
    )
  }
}

export default NameAuction

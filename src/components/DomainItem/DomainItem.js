import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import AddFavourite from '../AddFavourite/AddFavourite'
import { getPercentTimeLeft, getTimeLeft, humanizeDate } from '../../lib/utils'
import QueryAccount from '../QueryAccount'
import Loader from '../Loader'

const DomainContainer = styled('div')`
  &:before {
    content: '';
    background: ${p => {
      switch (p.state) {
        case 'Yours':
          return '#52E5FF'
        case 'Open':
          return '#42E068'
        case 'Auction':
        case 'Reveal':
          return 'linear-gradient(-180deg, #42E068 0%, #52E5FF 100%)'
        case 'Owned':
          return '#CACACA'
        case 'Forbidden':
          return 'black'
        case 'NotYetAvailable':
          return 'red'
        default:
          return 'red'
      }
    }};
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  padding: 20px;
  overflow: hidden;
  position: relative;
  background-color: white;
  background: ${({ percentDone }) =>
    percentDone
      ? `
  linear-gradient(to right, rgba(128, 255, 128, 0.1) 0%, rgba(82,229,255, 0.1) ${percentDone}%,#ffffff ${percentDone}%)`
      : 'white'};
  border-radius: 6px;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  margin-bottom: 4px;
  transition: 0.2s all;

  &:hover {
    z-index: 1;
    box-shadow: 3px 4px 20px 0 rgba(144, 171, 191, 0.42);
    .label-container {
      display: flex;
    }
  }
`

const RightContainer = styled('div')`
  display: flex;
  align-items: center;
`

const DomainName = styled('h2')`
  font-size: 28px;
  font-weight: 200;
  color: ${p => {
    switch (p.state) {
      case 'Yours':
        return '#2b2b2b'
      case 'Owned':
        return '#CCD4DA'
      default:
        return '#2b2b2b'
    }
  }};
`

const Price = styled('span')`
  margin-right: 20px;
  font-size: 28px;
  font-weight: 100;
`

const LabelContainer = styled('div')`
  margin-right: 20px;
  font-size: 16px;
  color: #ccd4da;
  display: none;
  align-items: center;
`

const LabelText = styled('div')``

const TimeLeft = styled('div')`
  border-left: 1px solid #ccd4da;
  margin-left: 10px;
  padding-left: 10px;
`

const Label = ({ domain, timeLeft, isOwner }) => {
  let text
  switch (domain.state) {
    case 'Open':
      text = 'Available'
      break
    case 'Auction':
      text = 'Bidding Period'
      break
    case 'Owned':
      text = 'Unavailable'
      break
    case 'Forbidden':
      text = 'Forbidden'
      break
    case 'Reveal':
      text = 'Reveal Period'
      break
    default:
      text = 'Unknown State'
  }

  if (isOwner) {
    text = 'Owner'
  }

  let timeLeftHuman

  if (domain.state === 'Auction' || domain.state === 'Reveal') {
    timeLeftHuman = humanizeDate(timeLeft)
  }

  return (
    <LabelContainer className="label-container">
      <LabelText>{text}</LabelText>
      {domain.state === 'Auction' || domain.state === 'Reveal' ? (
        <TimeLeft>{`${timeLeftHuman} left`}</TimeLeft>
      ) : (
        ''
      )}
    </LabelContainer>
  )
}

const Domain = ({ domain, isSubDomain, className, isFavourite, loading }) => {
  if (loading) {
    return (
      <DomainContainer
        state={'Owned'}
        className={className}
        percentDone={percentDone}
      >
        <Loader />
      </DomainContainer>
    )
  }
  let timeLeft = getTimeLeft(domain)

  let percentDone = getPercentTimeLeft(timeLeft, domain)
  return (
    <QueryAccount>
      {({ account }) => {
        const isOwner = domain.owner
          ? domain.owner.toLowerCase() === account.toLowerCase()
          : false
        return (
          <DomainContainer
            state={isOwner ? 'Yours' : domain.state}
            className={className}
            percentDone={percentDone}
          >
            <DomainName state={isOwner ? 'Yours' : domain.state}>
              {domain.name}
            </DomainName>
            <RightContainer>
              <Label domain={domain} timeLeft={timeLeft} isOwner={isOwner} />
              {isSubDomain && domain.state === 'Open' ? (
                <Price className="price">
                  {domain.price > 0 ? `${domain.price} ETH` : 'Free'}
                </Price>
              ) : (
                ''
              )}
              <AddFavourite
                domain={domain}
                isSubDomain={isSubDomain}
                isFavourite={isFavourite}
              />

              <Button primary href={`/name/${domain.name}`}>
                Details
              </Button>
            </RightContainer>
          </DomainContainer>
        )
      }}
    </QueryAccount>
  )
}

export default Domain

import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import AddFavourite from '../AddFavourite/AddFavourite'

import moment from 'moment'

const DomainContainer = styled('div')`
  &:before {
    content: '';
    background: ${p => {
      switch (p.state) {
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

  &:hover {
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

const Label = ({ domain, timeLeft }) => {
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

  let timeLeftHuman

  if (domain.state === 'Auction' || domain.state === 'Reveal') {
    timeLeftHuman = moment.duration(timeLeft).humanize()
  }

  return (
    <LabelContainer className="label-container">
      <LabelText>{text}</LabelText>
      {domain.state === 'Auction' && (
        <TimeLeft>{`${timeLeftHuman} left`}</TimeLeft>
      )}
    </LabelContainer>
  )
}

function getTimeLeft(endDate) {
  return new Date(endDate).getTime() - new Date().getTime()
}

const Domain = ({ domain, isSubDomain, className, isFavourite }) => {
  let timeLeft = false
  let percentDone = 0
  if (domain.state === 'Auction') {
    timeLeft = getTimeLeft(domain.revealDate)
    let totalTime = 259200000
    percentDone = ((totalTime - timeLeft) / totalTime) * 100
  } else if (domain.state === 'Reveal') {
    timeLeft = getTimeLeft(domain.registrationDate)
    let totalTime = 172800000
    percentDone = ((totalTime - timeLeft) / totalTime) * 100
  }

  return (
    <DomainContainer
      state={domain.state}
      className={className}
      percentDone={percentDone}
    >
      <DomainName state={domain.state}>{domain.name}</DomainName>
      <RightContainer>
        <Label domain={domain} timeLeft={timeLeft} />
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
}

export default Domain

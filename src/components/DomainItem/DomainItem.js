import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import mq from 'mediaQuery'

import AddFavourite from '../AddFavourite/AddFavourite'
import QueryAccount from '../QueryAccount'
import Loader from '../Loader'
import { humaniseName } from '../../utils/utils'

const DomainContainer = styled(Link)`
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
  color: #2b2b2b;
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
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  margin-bottom: 4px;
  transition: 0.2s all;

  ${mq.medium`
    height: 90px
  `}

  &:hover {
    color: #2b2b2b;
    z-index: 1;
    box-shadow: 3px 4px 20px 0 rgba(144, 171, 191, 0.42);
    .label-container {
      display: flex;
    }
  }

  &:visited {
    color: #2b2b2b;
  }
`

const RightContainer = styled('div')`
  display: flex;
  align-items: center;
`

const DomainName = styled('h2')`
  font-size: 18px;
  font-weight: 200;

  ${mq.medium`
    font-size: 28px;
  `}

  color: ${p => {
    switch (p.state) {
      case 'Yours':
      case 'Owned':
        return '#2b2b2b'
      default:
        return '#2b2b2b'
    }
  }};
`

const Price = styled('span')`
  margin-right: 20px;
  font-size: 18px;
  font-weight: 100;
  display: none;
  ${mq.small`
    display: inline;
  `}
  ${mq.medium`
    font-size: 28px;
  `}
`

const LabelContainer = styled('div')`
  margin-right: 20px;
  font-size: 16px;
  color: #ccd4da;
  display: none;
  align-items: center;
`

const LabelText = styled('div')``

const Label = ({ domain, isOwner }) => {
  let text
  switch (domain.state) {
    case 'Open':
      text = 'Available'
      break
    case 'Auction':
      text = 'In Auction'
      break
    case 'Owned':
      text = 'Unavailable'
      break
    default:
      text = 'Unknown State'
  }

  if (isOwner) {
    text = 'Owner'
  }

  return (
    <LabelContainer className="label-container">
      <LabelText>{text}</LabelText>
    </LabelContainer>
  )
}

const Domain = ({ domain, isSubDomain, className, isFavourite, loading }) => {
  if (loading) {
    return (
      <DomainContainer state={'Owned'} className={className} to="">
        <Loader />
      </DomainContainer>
    )
  }

  return (
    <QueryAccount>
      {({ account }) => {
        let isOwner = false

        if (domain.owner && parseInt(domain.owner, 16) !== 0) {
          isOwner = domain.owner.toLowerCase() === account.toLowerCase()
        }

        const percentDone = 0
        return (
          <DomainContainer
            to={`/name/${domain.name}`}
            state={isOwner ? 'Yours' : domain.state}
            className={className}
            percentDone={percentDone}
          >
            <DomainName state={isOwner ? 'Yours' : domain.state}>
              {humaniseName(domain.name)}
            </DomainName>
            <RightContainer>
              <Label domain={domain} isOwner={isOwner} />
              {isSubDomain && domain.state === 'Open' ? (
                <Price className="price">
                  {domain.price
                    ? domain.price > 0
                      ? `${domain.price} ETH`
                      : 'Free'
                    : ''}
                </Price>
              ) : (
                ''
              )}
              <AddFavourite
                domain={domain}
                isSubDomain={isSubDomain}
                isFavourite={isFavourite}
              />
            </RightContainer>
          </DomainContainer>
        )
      }}
    </QueryAccount>
  )
}

export default Domain

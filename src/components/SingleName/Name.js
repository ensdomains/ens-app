import React from 'react'
import styled from '@emotion/styled'

import mq, { useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'

import { Title } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import NameRegister from './NameRegister'
import Tabs from './Tabs'
import QueryAccount from '../QueryAccount'

const NameContainer = styled('div')`
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 0;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  ${mq.small`
    border-radius: 6px;
  `}

  &:before {
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    display: block;
    content: '';
    background: ${({ state }) => {
      switch (state) {
        case 'Owned':
          return '#CACACA'
        case 'Auction':
        case 'Reveal':
          return 'linear-gradient(-180deg, #42E068 0%, #52E5FF 100%)'
        case 'Yours':
          return '#52e5ff'
        case 'Open':
          return '#42E068'
        default:
          return '#CACACA'
      }
    }};
    position: absolute;
  }
`

const TopBar = styled('div')`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ededed;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.2);

  background: ${({ percentDone }) =>
    percentDone
      ? `
  linear-gradient(to right, rgba(128, 255, 128, 0.1) 0%, rgba(82,229,255, 0.1) ${percentDone}%,#ffffff ${percentDone}%)`
      : 'white'};
`

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const Favourite = styled(DefaultFavourite)``

function isRegistrationOpen(domain, isDeedOwner) {
  let { available, parent } = domain
  return parent === 'eth' && !isDeedOwner && available
}

function isOwnerOfDomain(domain, account) {
  if (domain.owner !== EMPTY_ADDRESS) {
    return domain.owner.toLowerCase() === account.toLowerCase()
  }
  return false
}

function Name({ details: domain, name, pathname, refetch }) {
  const smallBP = useMediaMin('small')
  const percentDone = 0

  return (
    <QueryAccount>
      {({ account }) => {
        const isOwner = isOwnerOfDomain(domain, account)
        const isDeedOwner = domain.deedOwner === account

        return (
          <NameContainer state={isOwner ? 'Yours' : domain.state}>
            <TopBar percentDone={percentDone}>
              <Title>{name}</Title>
              <RightBar>
                {isOwner && <Owner>Owner</Owner>}
                <Favourite domain={domain} />
                {smallBP &&
                  domain.parent === 'eth' &&
                  domain.state === 'Owned' && (
                    <Tabs pathname={pathname} domain={domain} />
                  )}
              </RightBar>
            </TopBar>
            {!smallBP &&
              domain.parent === 'eth' &&
              domain.state === 'Owned' && (
                <Tabs pathname={pathname} domain={domain} />
              )}
            {isRegistrationOpen(domain, isDeedOwner) ? (
              <NameRegister
                domain={domain}
                pathname={pathname}
                refetch={refetch}
                readOnly={account === EMPTY_ADDRESS}
              />
            ) : (
              <NameDetails
                domain={domain}
                pathname={pathname}
                name={name}
                isOwner={isOwner}
                refetch={refetch}
                account={account}
              />
            )}
          </NameContainer>
        )
      }}
    </QueryAccount>
  )
}

export default Name

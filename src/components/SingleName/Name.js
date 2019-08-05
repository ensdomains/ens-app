import React from 'react'
import styled from '@emotion/styled'

import mq, { useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'

import { Title } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import NameRegister from './NameRegister'
import DNSNameRegister from './DNSNameRegister'
import ShortName from './ShortName'
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

function isDNSRegistrationOpen(domain) {
  return domain.isDNSRegistrar && domain.owner === EMPTY_ADDRESS
}

function isOwnerOfDomain(domain, account) {
  if (domain.owner !== EMPTY_ADDRESS) {
    return domain.owner.toLowerCase() === account.toLowerCase()
  }
  return false
}

function isOwnerOfParentDomain(domain, account) {
  if (domain.parentOwner !== EMPTY_ADDRESS) {
    return domain.parentOwner.toLowerCase() === account.toLowerCase()
  }
  return false
}

function Name({ details: domain, name, pathname, type, refetch }) {
  const smallBP = useMediaMin('small')
  const percentDone = 0

  return (
    <QueryAccount>
      {({ account }) => {
        const hasAnOwner = domain.owner !== EMPTY_ADDRESS
        const isOwner = isOwnerOfDomain(domain, account)
        const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
        const isDeedOwner = domain.deedOwner === account
        const isRegistrant = domain.registrant === account
        const registrationOpen = isRegistrationOpen(domain, isDeedOwner)
        let ownerType
        if (isDeedOwner || isRegistrant) {
          ownerType = 'Registrant'
        } else if (isOwner) {
          ownerType = 'Controller'
        }
        let containerState
        if (isDNSRegistrationOpen(domain)) {
          containerState = 'Open'
        } else {
          containerState = isOwner ? 'Yours' : domain.state
        }
        return (
          <NameContainer state={containerState}>
            <TopBar percentDone={percentDone}>
              <Title>
                {domain.decrypted
                  ? name
                  : '[unknown' +
                    domain.name.split('.')[0].slice(1, 11) +
                    ']' +
                    '.' +
                    domain.parent}
              </Title>
              <RightBar>
                {!!ownerType && <Owner>{ownerType}</Owner>}
                <Favourite domain={domain} />
                {smallBP && hasAnOwner && (
                  <Tabs pathname={pathname} domain={domain} />
                )}
              </RightBar>
            </TopBar>
            {!smallBP && hasAnOwner && (
              <Tabs pathname={pathname} domain={domain} />
            )}
            {registrationOpen ? (
              <NameRegister
                domain={domain}
                pathname={pathname}
                refetch={refetch}
                readOnly={account === EMPTY_ADDRESS}
              />
            ) : isDNSRegistrationOpen(domain) ? (
              <DNSNameRegister
                domain={domain}
                pathname={pathname}
                refetch={refetch}
                account={account}
                readOnly={account === EMPTY_ADDRESS}
              />
            ) : type === 'short' ? (
              <ShortName />
            ) : (
              <NameDetails
                domain={domain}
                pathname={pathname}
                name={name}
                isOwner={isOwner}
                isOwnerOfParent={isOwnerOfParent}
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

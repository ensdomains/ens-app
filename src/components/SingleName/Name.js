import React from 'react'
import styled from '@emotion/styled'

import { useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'
import warning from '../../assets/yellowwarning.svg'

import { Title } from '../Typography/Basic'
import TopBar from '../Basic/TopBar'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import DNSNameRegister from './DNSNameRegister'
import ShortName from './ShortName'
import Tabs from './Tabs'
import { useAccount } from '../QueryAccount'
import NameContainer from '../Basic/MainContainer'

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const RenewalReminder = styled('div')`
  h3 {
    margin: 0;
    color: #f5a623;
    font-weight: 300;
    font-size: 18px;
  }
  border-radius: 5px;
  color: #2b2b2b;
  font-weight: 300;
  font-size: 18px;
  background: white;
  padding: 20px;
  margin-bottom: 20px;
`

const Favourite = styled(DefaultFavourite)``

function isRegistrationOpen(available, parent, isDeedOwner) {
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
  const account = useAccount()
  const isOwner = isOwnerOfDomain(domain, account)
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const hasAnOwner = parseInt(domain.owner, 16) !== 0
  const preferredTab = hasAnOwner ? 'details' : 'register'

  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = domain.registrant === account
  const registrationOpen = isRegistrationOpen(
    domain.available,
    domain.parent,
    isDeedOwner
  )

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
    <>
      <RenewalReminder>
        <h3>
          <img src={warning} />
          &nbsp; Names in May are expiring soon
        </h3>
        Click the renew button to avoid expiration. To renew all of your names
        in bulk, navigate to My Names
      </RenewalReminder>
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
            {!!ownerType && <Owner data-testid="owner-type">{ownerType}</Owner>}
            <Favourite domain={domain} />
            {smallBP && (
              <Tabs
                pathname={pathname}
                tab={preferredTab}
                domain={domain}
                parent={domain.parent}
              />
            )}
          </RightBar>
        </TopBar>
        {!smallBP && (
          <Tabs
            pathname={pathname}
            tab={preferredTab}
            domain={domain}
            parent={domain.parent}
          />
        )}
        {isDNSRegistrationOpen(domain) ? (
          <DNSNameRegister
            domain={domain}
            pathname={pathname}
            refetch={refetch}
            account={account}
            readOnly={account === EMPTY_ADDRESS}
          />
        ) : type === 'short' && domain.owner === EMPTY_ADDRESS ? ( // check it's short and hasn't been claimed already
          <ShortName name={name} />
        ) : (
          <NameDetails
            tab={preferredTab}
            domain={domain}
            pathname={pathname}
            name={name}
            isOwner={isOwner}
            isOwnerOfParent={isOwnerOfParent}
            refetch={refetch}
            account={account}
            registrationOpen={registrationOpen}
          />
        )}
      </NameContainer>
    </>
  )
}

export default Name

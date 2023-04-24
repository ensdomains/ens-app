import { gql, useQuery } from '@apollo/client'
import styled from '@emotion/styled/macro'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getNamehash } from '@ensdomains/ui'
import { GET_NAME_WRAPPER_DATA } from 'graphql/queries'
import { useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'
import { isOwnerOfParentDomain } from '../../utils/utils'
import DefaultFavourite from '../AddFavourite/Favourite'
import { NonMainPageBannerContainerWithMarginBottom } from '../Banner/DAOBanner'
import NameWrapperBanner from '../Banner/NameWrapperBanner'
import NameContainer from '../Basic/MainContainer'
import TopBar from '../Basic/TopBar'
import Copy from '../CopyToClipboard/'
import { Title } from '../Typography/Basic'
import DNSNameRegister from './DNSNameRegister'
import NameDetails from './NameDetails'
import ShortName from './ShortName'
import Tabs from './Tabs'

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const Favourite = styled(DefaultFavourite)``

function isRegistrationOpen(available, parent) {
  return parent === 'eth' && available
}

function isDNSRegistrationOpen(domain) {
  const nameArray = domain.name?.split('.')
  if (nameArray?.length !== 2 || nameArray?.[1] === 'eth') {
    return false
  }
  return domain.isDNSRegistrar && domain.owner === EMPTY_ADDRESS
}

function isOwnerOfDomain(domain, account) {
  if (domain.owner !== EMPTY_ADDRESS && !domain.available) {
    return domain.owner?.toLowerCase() === account?.toLowerCase()
  }
  return false
}

const useNameWrapperVariables = (domain, account) => {
  const {
    data: { getNameWrapperData: { isWrapped, owner } } = {
      getNameWrapperData: {}
    }
  } = useQuery(GET_NAME_WRAPPER_DATA, {
    variables: { node: getNamehash(domain.name) }
  })
  return {
    isNameWrapped: isWrapped,
    isNameWrappedOwner: owner === account
  }
}

const NAME_REGISTER_DATA_WRAPPER = gql`
  query nameRegisterDataWrapper @client {
    accounts
    networkId
    isReadOnly
  }
`

export const useRefreshComponent = () => {
  const [key, setKey] = useState(0)
  const {
    data: { accounts, networkId, isReadOnly }
  } = useQuery(NAME_REGISTER_DATA_WRAPPER)
  const mainAccount = accounts?.[0]
  useEffect(() => {
    setKey(x => x + 1)
  }, [mainAccount, networkId, isReadOnly])
  return key
}

const ACCOUNT_CONNECTED_QUERY = gql`
  query nameQuery @client {
    accounts
    isReadOnly
  }
`

function Name({ details: domain, name, pathname, type, refetch }) {
  const { t } = useTranslation()
  const smallBP = useMediaMin('small')
  const percentDone = 0

  const {
    data: { accounts, isReadOnly }
  } = useQuery(ACCOUNT_CONNECTED_QUERY)

  const account = accounts?.[0]
  const isOwner = isOwnerOfDomain(domain, account)
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = !domain.available && domain.registrant === account

  const registrationOpen = isRegistrationOpen(domain.available, domain.parent)
  const preferredTab = registrationOpen ? 'register' : 'details'

  let ownerType,
    registrarAddress = domain.parentOwner
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

  const key = useRefreshComponent()

  // Name Wrapper
  const { isNameWrapped, isNameWrappedOwner } = useNameWrapperVariables(
    domain,
    account
  )
  const isOwnerOrNameWrappedOwner = isOwner || isNameWrappedOwner
  const showNameWrapperBanner = isOwnerOrNameWrappedOwner

  return (
    <>
      {showNameWrapperBanner ? (
        <NonMainPageBannerContainerWithMarginBottom>
          <NameWrapperBanner isWrapped={isNameWrapped} name={name} />
        </NonMainPageBannerContainerWithMarginBottom>
      ) : (
        ''
      )}
      <NameContainer state={containerState} key={key}>
        <TopBar percentDone={percentDone}>
          <Title>
            {domain?.decrypted
              ? name
              : '[unknown' +
                domain.name?.split('.')[0].slice(1, 11) +
                ']' +
                '.' +
                domain.parent}
            <Copy
              value={
                domain?.decrypted
                  ? name
                  : '[unknown' +
                    domain.name?.split('.')[0].slice(1, 11) +
                    ']' +
                    '.' +
                    domain.parent
              }
            />
          </Title>
          <RightBar>
            {!!ownerType && (
              <Owner data-testid="owner-type">
                {ownerType === 'Registrant'
                  ? t('c.registrant')
                  : t('c.Controller')}
              </Owner>
            )}
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
            registrarAddress={registrarAddress}
            pathname={pathname}
            refetch={refetch}
            account={account}
            readOnly={isNameWrapped || account === EMPTY_ADDRESS}
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
            isNameWrapped={isNameWrapped}
            isReadOnly={isReadOnly}
          />
        )}
      </NameContainer>
    </>
  )
}

export default Name

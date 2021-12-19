import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import mq from 'mediaQuery'
import { useQuery } from '@apollo/client'

import NoAccountsModal from '../NoAccounts/NoAccountsModal'
import { GET_REVERSE_RECORD } from '../../graphql/queries'
import { connectProvider, disconnectProvider } from '../../utils/providerUtils'

const NetworkInformationContainer = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  ${mq.medium`
    display: block;
    border: none;
  `}
`

const NetworkStatus = styled('div')`
  color: #cacaca;
  font-size: 14px;
  text-transform: capitalize;
  font-weight: 100;
  margin-top: -2px;
  margin-left: 1px;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: flex;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #ea6060;
    margin-right: 5px;
  }
`

const Account = styled('div')`
  color: #adbbcd;
  font-size: 16px;
  font-weight: 200;
  font-family: Overpass Mono;
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AccountContainer = styled('div')`
  padding: 10px 10px 10px 16px;
  text-align:center
  position: relative;
  ${mq.medium`
    width: 225px;
    &:hover {
      width: 225px;
      background: white;
      border-radius: 6px;
      .account {
        width: 200px;
        overflow: visible;
        white-space: normal;
      }
    }
  `}
`

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`

function NetworkInformation() {
  const { t } = useTranslation()
  const {
    data: { accounts, isSafeApp, network, displayName, isReadOnly }
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })

  return (
    <NetworkInformationContainer hasAccount={accounts && accounts.length > 0}>
      {!isReadOnly ? (
        <AccountContainer>
          <Account data-testid="account" className="account">
            <span>{displayName}</span>
          </Account>
          <NetworkStatus>
            {network} {t('c.network')}
          </NetworkStatus>
          {!isSafeApp && (
            <NoAccountsModal
              onClick={disconnectProvider}
              buttonText={t('c.disconnect')}
              colour={'#F5A623'}
            />
          )}
        </AccountContainer>
      ) : (
        <AccountContainer>
          <Account data-testid="account" className="account">
            {t('c.readonly')}
          </Account>
          <NetworkStatus>
            {network} {t('c.network')}
          </NetworkStatus>
          <NoAccountsModal
            onClick={connectProvider}
            colour={'#F5A623'}
            buttonText={t('c.connect')}
          />
        </AccountContainer>
      )}
    </NetworkInformationContainer>
  )
}
export default NetworkInformation

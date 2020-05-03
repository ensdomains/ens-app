import React from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

import mq from 'mediaQuery'

import UnstyledBlockies from '../Blockies'
import NoAccountsModal from '../NoAccounts/NoAccountsModal'
import Loader from 'components/Loader'
import useNetworkInfo from './useNetworkInfo'
import { useQuery } from 'react-apollo'
import { GET_REVERSE_RECORD } from '../../graphql/queries'

const NetworkInformationContainer = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
  ${mq.medium`
    margin-bottom: 50px;
    display: block;
    border: none;
  `}
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 10px;
  ${mq.medium`
    box-shadow: 3px 5px 24px 0 #d5e2ec;
  `}
`

const Avatar = styled('img')`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 10px;
  ${mq.medium`
    box-shadow: 3px 5px 24px 0 #d5e2ec;
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
    background: #5284ff;
    margin-right: 5px;
  }
`

const Account = styled('div')`
  color: #adbbcd;
  font-size: 18px;
  font-weight: 200;
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AccountContainer = styled('div')`
  padding: 10px 10px 10px 65px;
  position: relative;
  ${mq.medium`
    transform: translate(-25px, 5px);
    width: 200px;
    &:hover {
      width: 475px;
      background: white;
      box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
      border-radius: 6px;
      .account {
        width: 200px;
        overflow: visible;
        white-space: normal;
      }
    }
  `}
`

const Waiting = styled('div')`
  color: #ccc;
  display: flex;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
`

const WaitingText = styled('span')`
  margin-right: 5px;
`

function NetworkInformation() {
  const { t } = useTranslation()
  const { accounts, network, loading, error } = useNetworkInfo()
  const address = accounts && accounts[0]
  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address
    }
  })
  const displayName =
    getReverseRecord && getReverseRecord.name ? getReverseRecord.name : address

  if (loading) {
    return (
      <Waiting>
        <WaitingText>Waiting for accounts</WaitingText> <Loader />
      </Waiting>
    )
  }

  if (error) {
    return (
      <Waiting>
        <WaitingText>Error getting accounts</WaitingText>
      </Waiting>
    )
  }

  return (
    <NetworkInformationContainer hasAccount={accounts.length > 0}>
      {accounts.length > 0 ? (
        <AccountContainer>
          {!reverseRecordLoading && getReverseRecord && getReverseRecord.avatar ? (
            <Avatar src={getReverseRecord.avatar} />
          ) : (
            <Blockies address={accounts[0]} imageSize={47} />
          )}
          <Account data-testid="account" className="account">
            <span>{displayName}</span>
          </Account>
          <NetworkStatus>
            {network} {t('c.network')}
          </NetworkStatus>
        </AccountContainer>
      ) : (
        <NoAccountsModal colour={'#F5A623'} />
      )}
    </NetworkInformationContainer>
  )
}
export default NetworkInformation

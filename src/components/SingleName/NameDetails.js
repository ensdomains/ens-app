import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Link, Route } from 'react-router-dom'

import { HR } from '../Typography/Basic'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import RecordsItem from './RecordsItem'
import DetailsItemEditable from './DetailsItemEditable'
import AddRecord from './AddRecord'
import SetupName from '../SetupName/SetupName'
import TransferRegistrars from './TransferRegistrars'

import {
  SET_OWNER,
  SET_RESOLVER,
  SET_ADDRESS,
  SET_CONTENT,
  SET_CONTENTHASH,
  SET_REGISTRANT,
  RECLAIM,
  RENEW
} from '../../graphql/mutations'

import NameClaimTestDomain from './NameClaimTestDomain'

import { formatDate } from '../../utils/dates'

const Details = styled('section')`
  padding: 40px;
  transition: 0.4s;
`

const Records = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  padding-bottom: ${p => (p.hasRecord ? '10px' : '0')};
  display: ${p => (!p.isOwner && !p.hasRecord ? 'none' : 'block')};
`

const ExpirationDetailsValue = styled(DetailsValue)`
  color: ${p => (p.isExpired ? 'red' : null)};
`

function canClaim(domain) {
  if (!domain.name.match(/\.test$/)) return false
  return parseInt(domain.owner) === 0 || domain.expiryTime < new Date()
}

function showTransfer(domain, isDeedOwner, isPermanentRegistrarDeployed) {
  return (
    isPermanentRegistrarDeployed &&
    isDeedOwner &&
    domain.currentBlockDate > domain.transferEndDate
  )
}

class NameDetails extends Component {
  isEmpty(record) {
    if (parseInt(record, 16) === 0) {
      return true
    }
    if (record === '0x') {
      return true
    }
    if (!record) {
      return true
    }
    return false
  }
  hasAnyRecord(domain) {
    if (parseInt(domain.resolver, 16) === 0) {
      return false
    }
    if (!this.isEmpty(domain.addr)) {
      return true
    }

    if (!this.isEmpty(domain.content)) {
      return true
    }
  }
  render() {
    const { domain, isOwner, refetch, account } = this.props
    const isDeedOwner = domain.deedOwner === account
    const isRegistrant = domain.registrant === account
    const isPermanentRegistrarDeployed = domain.available !== null

    const records = [
      {
        label: 'Address',
        value: 'address'
      },
      {
        label: 'Content',
        value: 'content'
      }
    ]

    const emptyRecords = records.filter(record => {
      if (record.value === 'address') {
        return this.isEmpty(domain['addr']) ? true : false
      }

      return this.isEmpty(domain[record.value]) ? true : false
    })

    let contentMutation
    if (domain.contentType === 'oldcontent') {
      contentMutation = SET_CONTENT
    } else {
      contentMutation = SET_CONTENTHASH
    }
    return (
      <>
        <Route
          exact
          path="/name/:name"
          render={() => {
            return showTransfer(
              domain,
              isDeedOwner,
              isPermanentRegistrarDeployed
            ) ? (
              <Details data-testid="name-details">
                <TransferRegistrars
                  label={domain.label}
                  currentBlockDate={domain.currentBlockDate}
                  transferEndDate={domain.transferEndDate}
                  migrationStartDate={domain.migrationStartDate}
                  refetch={refetch}
                  parent={domain.parent}
                  isOwner={isOwner}
                  isDeedOwner={isDeedOwner}
                  isNewRegistrar={domain.isNewRegistrar}
                />
              </Details>
            ) : (
              <Details data-testid="name-details">
                {isOwner && <SetupName />}
                {domain.parent && (
                  <DetailsItem uneditable>
                    <DetailsKey>Parent</DetailsKey>
                    <DetailsValue>
                      <Link to={`/name/${domain.parent}`}>{domain.parent}</Link>
                    </DetailsValue>
                  </DetailsItem>
                )}
                {domain.parent === 'eth' && domain.isNewRegistrar ? (
                  <>
                    <DetailsItemEditable
                      domain={domain}
                      keyName="Registrant"
                      value={domain.registrant}
                      canEdit={isRegistrant}
                      type="address"
                      editButton="Transfer"
                      mutationButton="Transfer"
                      mutation={SET_REGISTRANT}
                      refetch={refetch}
                      confirm={true}
                    />
                    <DetailsItemEditable
                      domain={domain}
                      keyName="Controller"
                      value={domain.owner}
                      canEdit={isOwner || isRegistrant}
                      deedOwner={domain.deedOwner}
                      isDeedOwner={isDeedOwner}
                      type="address"
                      editButton={isRegistrant ? 'Set' : 'Transfer'}
                      mutationButton={isRegistrant ? 'Set' : 'Transfer'}
                      mutation={isRegistrant ? RECLAIM : SET_OWNER}
                      refetch={refetch}
                      confirm={true}
                    />
                  </>
                ) : (
                  <DetailsItemEditable
                    domain={domain}
                    keyName="Controller"
                    value={domain.owner}
                    canEdit={isOwner}
                    deedOwner={domain.deedOwner}
                    isDeedOwner={isDeedOwner}
                    type="address"
                    editButton="Transfer"
                    mutationButton="Transfer"
                    mutation={SET_OWNER}
                    refetch={refetch}
                    confirm={true}
                  />
                )}

                {domain.registrationDate ? (
                  <DetailsItem uneditable>
                    <DetailsKey>Registration Date</DetailsKey>
                    <DetailsValue>
                      {formatDate(domain.registrationDate)}
                    </DetailsValue>
                  </DetailsItem>
                ) : (
                  ''
                )}
                {domain.expiryTime ? (
                  domain.isNewRegistrar ? (
                    <DetailsItemEditable
                      domain={domain}
                      keyName="Expiration Date"
                      value={domain.expiryTime}
                      canEdit={parseInt(account, 16) !== 0}
                      type="date"
                      editButton="Renew"
                      mutationButton="Renew"
                      mutation={RENEW}
                      refetch={refetch}
                      confirm={true}
                    />
                  ) : (
                    <DetailsItem uneditable>
                      <DetailsKey>Expiration Date</DetailsKey>
                      <ExpirationDetailsValue
                        isExpired={domain.expiryTime < new Date()}
                      >
                        {formatDate(domain.expiryTime)}
                      </ExpirationDetailsValue>
                    </DetailsItem>
                  )
                ) : (
                  ''
                )}
                {isPermanentRegistrarDeployed && (
                  <TransferRegistrars
                    label={domain.label}
                    currentBlockDate={domain.currentBlockDate}
                    transferEndDate={domain.transferEndDate}
                    migrationStartDate={domain.migrationStartDate}
                    refetch={refetch}
                    parent={domain.parent}
                    isOwner={isOwner}
                    isDeedOwner={isDeedOwner}
                    isNewRegistrar={domain.isNewRegistrar}
                  />
                )}
                <HR />
                <DetailsItemEditable
                  keyName="Resolver"
                  type="address"
                  value={domain.resolver}
                  canEdit={isOwner}
                  domain={domain}
                  editButton="Set"
                  mutationButton="Save"
                  mutation={SET_RESOLVER}
                  refetch={refetch}
                  account={account}
                />
                <Records
                  hasRecord={this.hasAnyRecord(domain)}
                  isOwner={isOwner}
                >
                  <AddRecord
                    emptyRecords={emptyRecords}
                    title="Records"
                    isOwner={isOwner}
                    domain={domain}
                    refetch={refetch}
                  />
                  {this.hasAnyRecord(domain) && (
                    <>
                      {!this.isEmpty(domain.addr) && (
                        <RecordsItem
                          domain={domain}
                          isOwner={isOwner}
                          keyName="Address"
                          value={domain.addr}
                          mutation={SET_ADDRESS}
                          type="address"
                          refetch={refetch}
                          account={account}
                        />
                      )}
                      {!this.isEmpty(domain.content) && (
                        <RecordsItem
                          domain={domain}
                          isOwner={isOwner}
                          keyName="Content"
                          type="content"
                          mutation={contentMutation}
                          value={domain.content}
                          refetch={refetch}
                        />
                      )}
                    </>
                  )}
                </Records>
                {canClaim(domain) ? (
                  <NameClaimTestDomain domain={domain} refetch={refetch} />
                ) : null}
              </Details>
            )
          }}
        />

        <Route
          exact
          path="/name/:name/subdomains"
          render={() => (
            <SubDomains
              domain={domain}
              isOwner={isOwner}
              data-testid="subdomains"
            />
          )}
        />
      </>
    )
  }
}
export default NameDetails

import React from 'react'
import styled from '@emotion/styled'
import { Link, Route } from 'react-router-dom'
import SubmitProof from './SubmitProof'
import Tooltip from '../Tooltip/Tooltip'
import { HR } from '../Typography/Basic'
import DefaultButton from '../Forms/Button'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import RecordsItem from './RecordsItem'
import DetailsItemEditable from './DetailsItemEditable'
import AddRecord from './AddRecord'
import SetupName from '../SetupName/SetupName'
import TransferRegistrars from './TransferRegistrars'
import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'
import { useState } from 'react'
import DefaultLoader from '../Loader'
import You from '../Icons/You'
import dnssecmodes from '../../api/dnssecmodes'
import { ReactComponent as DefaultOrangeExclamation } from '../Icons/OrangeExclamation.svg'

import {
  SET_OWNER,
  SET_SUBNODE_OWNER,
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

const Loader = styled(DefaultLoader)`
  width: 30%;
  margin: auto;
`

const Button = styled(DefaultButton)`
  position: absolute;
  width: 130px;
  background-colore: white;
`

const ButtonContainer = styled('div')`
  margin-top: 0;
  position: absolute;
  right: 180px;
  -webkit-transform: translate(0, -65%);
  -ms-transform: translate(0, -65%);
  transform: translate(0, -65%);
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

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
  align-items: center;
`

const Explainer = styled('div')`
  background: #f0f6fa;
  color: #adbbcd;
  display: flex;
  padding: 1em 0;
  margin-left: 180px;
  margin-bottom: 50px;
  padding-left 24px;
`

const ErrorExplainer = styled(Explainer)`
  background: #fef7e9;
`

const EtherScanLinkContainer = styled('span')`
  display: inline-block;
  transform: translate(25%, 20%);
`

const LinkToLearnMore = styled('a')`
  margin-right: 2em;
  font-size: 14px;
  letter-spacing: 0.58px;
  text-align: center;
  margin-left: auto;
`

const OrangeExclamation = styled(DefaultOrangeExclamation)`
  margin-right: 5px;
  margin-top: 6px;
  width: 15px;
  height: 15px;
`

const DNSOwnerError = styled('span')`
  color: #f5a623;
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

function isLegacyAuctionedName(domain) {
  return domain.parent === 'eth' && !domain.isNewRegistrar
}

function isEmpty(record) {
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

function hasAnyRecord(domain) {
  if (parseInt(domain.resolver, 16) === 0) {
    return false
  }
  if (!isEmpty(domain.addr)) {
    return true
  }

  if (!isEmpty(domain.content)) {
    return true
  }
}

function NameDetails({ domain, isOwner, isOwnerOfParent, refetch, account }) {
  const deedOwner = domain.deedOwner
  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = domain.registrant === account
  const isPermanentRegistrarDeployed = domain.available !== null
  const dnssecmode = dnssecmodes[domain.state]
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
      return isEmpty(domain['addr']) ? true : false
    }

    return isEmpty(domain[record.value]) ? true : false
  })

  let contentMutation
  if (domain.contentType === 'oldcontent') {
    contentMutation = SET_CONTENT
  } else {
    contentMutation = SET_CONTENTHASH
  }
  const showExplainer = !parseInt(domain.resolver)
  const [loading, setLoading] = useState(undefined)
  const canSubmit =
    domain.state === 5 && // This is for not allowing the case user does not have record rather than having empty address record.
    domain.owner.toLowerCase() !== domain.dnsOwner.toLowerCase()
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
              {isOwner && <SetupName initialState={showExplainer} />}
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
              ) : domain.parent === 'eth' && !domain.isNewRegistrar ? (
                <>
                  <DetailsItem uneditable>
                    <DetailsKey>Registrant</DetailsKey>
                    <DetailsValue>
                      <EtherScanLink address={domain.deedOwner}>
                        <SingleNameBlockies
                          address={domain.deedOwner}
                          imageSize={24}
                        />
                        {domain.deedOwner}
                      </EtherScanLink>
                    </DetailsValue>
                  </DetailsItem>
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
              ) : domain.isDNSRegistrar ? (
                <DetailsItem uneditable>
                  <DetailsKey>Controller {isOwner ? <You /> : ''}</DetailsKey>
                  <DetailsValue>
                    <EtherScanLink address={domain.owner}>
                      <SingleNameBlockies
                        address={domain.owner}
                        imageSize={24}
                      />
                      {domain.owner}
                    </EtherScanLink>
                  </DetailsValue>
                  <ButtonContainer>
                    {canSubmit ? (
                      <SubmitProof
                        name={domain.name}
                        parentOwner={domain.parentOwner}
                        refetch={refetch}
                        actionText={'Sync'}
                      />
                    ) : (
                      <Tooltip
                        text="The controller and DNS owner are already in sync"
                        position="left"
                        border={true}
                        warning={true}
                        offset={{ left: -30, top: 10 }}
                      >
                        {({ tooltipElement, showTooltip, hideTooltip }) => {
                          return (
                            <Button
                              onMouseOver={() => {
                                showTooltip()
                              }}
                              onMouseLeave={() => {
                                hideTooltip()
                              }}
                              type="disabled"
                            >
                              Sync
                              {tooltipElement}
                            </Button>
                          )
                        }}
                      </Tooltip>
                    )}
                  </ButtonContainer>
                </DetailsItem>
              ) : (
                // Either subdomain, .test, or .dns(eg. .xyz)
                <DetailsItemEditable
                  domain={domain}
                  keyName="Controller"
                  value={domain.owner}
                  canEdit={
                    domain.isDNSRegistrar && domain.owner !== domain.dnsOwner
                  }
                  deedOwner={domain.deedOwner}
                  isDeedOwner={isDeedOwner}
                  type="address"
                  editButton={isOwnerOfParent ? 'Set' : 'Transfer'}
                  mutationButton={isOwnerOfParent ? 'Set' : 'Transfer'}
                  mutation={isOwnerOfParent ? SET_SUBNODE_OWNER : SET_OWNER}
                  refetch={refetch}
                  confirm={true}
                />
              )}
              {/* To be replaced with a logic a function to detect dnsregistrar */}
              {domain.isDNSRegistrar ? (
                <>
                  <DetailsItem uneditable>
                    <DetailsKey>DNS OWNER</DetailsKey>
                    <DetailsValue>
                      {dnssecmode.displayError ? (
                        <DNSOwnerError>{dnssecmode.title}</DNSOwnerError>
                      ) : (
                        <EtherScanLink address={domain.dnsOwner}>
                          <SingleNameBlockies
                            address={domain.dnsOwner}
                            imageSize={24}
                          />
                          {domain.dnsOwner}
                        </EtherScanLink>
                      )}
                    </DetailsValue>
                    <ButtonContainer>
                      {loading ? (
                        <Button>
                          <Loader />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setLoading(true)
                            refetch()
                              .then(dd => {
                                setLoading(false)
                              })
                              .catch(err => {
                                console.log('failed to refetch', err)
                              })
                          }}
                        >
                          Refresh{' '}
                        </Button>
                      )}
                    </ButtonContainer>
                  </DetailsItem>
                  {dnssecmode.displayError ? (
                    <ErrorExplainer>
                      <OrangeExclamation />
                      Solve the error in your Domain registrar. Refresh to
                      reflect updates.
                      <LinkToLearnMore
                        href="https://docs.ens.domains/dns-registrar-guide"
                        target="_blank"
                      >
                        Learn More{' '}
                        <EtherScanLinkContainer>
                          <ExternalLinkIcon />
                        </EtherScanLinkContainer>
                      </LinkToLearnMore>
                    </ErrorExplainer>
                  ) : (
                    <Explainer>
                      *Click ‘refresh’ if you make changes to the domain in the
                      DNS Registrar.
                      <LinkToLearnMore
                        href="https://docs.ens.domains/dns-registrar-guide"
                        target="_blank"
                      >
                        Learn More{' '}
                        <EtherScanLinkContainer>
                          <ExternalLinkIcon />
                        </EtherScanLinkContainer>
                      </LinkToLearnMore>
                    </Explainer>
                  )}
                </>
              ) : (
                ''
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
              ) : isPermanentRegistrarDeployed &&
                isLegacyAuctionedName(domain) ? (
                <DetailsItem uneditable>
                  <DetailsKey>Expiration Date</DetailsKey>
                  <ExpirationDetailsValue
                    isExpired={domain.transferEndDate < new Date()}
                  >
                    {formatDate(domain.transferEndDate)}
                  </ExpirationDetailsValue>
                </DetailsItem>
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
              <Records hasRecord={hasAnyRecord(domain)} isOwner={isOwner}>
                <AddRecord
                  emptyRecords={emptyRecords}
                  title="Records"
                  isOwner={isOwner}
                  domain={domain}
                  refetch={refetch}
                />
                {hasAnyRecord(domain) && (
                  <>
                    {!isEmpty(domain.addr) && (
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
                    {!isEmpty(domain.content) && (
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

export default NameDetails

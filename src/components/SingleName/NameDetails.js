import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled'
import { Link, Route } from 'react-router-dom'

import {
  SET_OWNER,
  SET_SUBNODE_OWNER,
  SET_REGISTRANT,
  RECLAIM,
  RENEW
} from '../../graphql/mutations'
import { IS_MIGRATED } from '../../graphql/queries'

import { formatDate } from '../../utils/dates'
import { EMPTY_ADDRESS } from '../../utils/records'

import NameRegister from './NameRegister'
import SubmitProof from './SubmitProof'
import Tooltip from '../Tooltip/Tooltip'
import { HR } from '../Typography/Basic'
import DefaultButton from '../Forms/Button'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DetailsItemEditable from './DetailsItemEditable'
import SetupName from '../SetupName/SetupName'
import { SingleNameBlockies } from './SingleNameBlockies'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'
import DefaultLoader from '../Loader'
import You from '../Icons/You'
import dnssecmodes from '../../api/dnssecmodes'
import { ReactComponent as DefaultOrangeExclamation } from '../Icons/OrangeExclamation.svg'
import DefaultAddressLink from '../Links/AddressLink'
import ResolverAndRecords from './ResolverAndRecords'
import NameClaimTestDomain from './NameClaimTestDomain'
import RegistryMigration from './RegistryMigration'
import ReleaseDeed from './ReleaseDeed'

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
  right: ${props => (props.outOfSync ? '195px' : '180px')};
  -webkit-transform: translate(0, -65%);
  -ms-transform: translate(0, -65%);
  transform: translate(0, -65%);
`

const ExpirationDetailsValue = styled(DetailsValue)`
  color: ${p => (p.isExpired ? 'red' : null)};
`

const AddressLink = styled(DefaultAddressLink)`
  display: flex;
  align-items: center;
`

const Explainer = styled('div')`
  background: #f0f6fa;
  color: #adbbcd;
  display: flex;
  padding: 1em 0;
  margin-left: 180px;
  margin-bottom: 45px;
  padding-left 24px;
`

const ErrorExplainer = styled(Explainer)`
  background: #fef7e9;
`

const OutOfSyncExplainer = styled('div')`
  margin-top: 20px;
  background: #fef7e9;
  display: flex;
`

const OutOfSyncExplainerContainer = styled('div')`
  margin-top: 15px;
`

const EtherScanLinkContainer = styled('span')`
  display: inline-block;
  transform: translate(25%, 20%);
`

const LinkToLearnMore = styled('a')`
  margin-right: ${props => (props.outOfSync ? '' : '2em')};
  font-size: 14px;
  letter-spacing: 0.58px;
  text-align: center;
  margin-left: auto;
  min-width: 130px;
`

const OrangeExclamation = styled(DefaultOrangeExclamation)`
  margin-right: 5px;
  margin-top: 6px;
  width: 20px;
  height: 20px;
`

const DNSOwnerError = styled('span')`
  color: #f5a623;
`

const OwnerFields = styled('div')`
  background: ${props => (props.outOfSync ? '#fef7e9' : '')};
  padding: ${props => (props.outOfSync ? '1.5em' : '0')};
  margin-bottom: ${props => (props.outOfSync ? '1.5em' : '0')};
`

const DomainOwnerAddress = styled(`span`)`
  color: ${props => (props.outOfSync ? '#CACACA' : '')};
`

const GracePeriodWarningContainer = styled('div')`
  font-family: 'Overpass';
  background: #fef7e9;
  padding: 10px 20px;
  margin: 5px 0px;
`

const GracePeriodText = styled('span')`
  color: #cacaca;
  margin-left: 0.5em;
`

const GracePeriodDate = styled('span')`
  font-weight: bold;
`

const Expiration = styled('span')`
  color: #f5a623;
  font-weight: bold;
`

const GracePeriodWarning = ({ date }) => {
  return (
    <GracePeriodWarningContainer>
      <Expiration>Expiring soon.</Expiration>
      <GracePeriodText>
        Grace period ends <GracePeriodDate>{formatDate(date)}</GracePeriodDate>
      </GracePeriodText>
    </GracePeriodWarningContainer>
  )
}

function canClaim(domain) {
  if (!domain.name.match(/\.test$/)) return false
  return parseInt(domain.owner) === 0 || domain.expiryTime < new Date()
}

function NameDetails({
  domain,
  isOwner,
  isOwnerOfParent,
  refetch,
  account,
  registrationOpen
}) {
  const [loading, setLoading] = useState(undefined)
  const {
    data,
    loading: loadingIsMigrated,
    refetch: refetchIsMigrated
  } = useQuery(IS_MIGRATED, {
    variables: {
      name: domain.name
    }
  })

  const isMigratedToNewRegistry = !loadingIsMigrated && data && data.isMigrated

  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = domain.registrant === account
  const dnssecmode = dnssecmodes[domain.state]

  const showExplainer = !parseInt(domain.resolver)

  const canSubmit =
    domain.isDNSRegistrar &&
    dnssecmode.state === 'SUBMIT_PROOF' && // This is for not allowing the case user does not have record rather than having empty address record.
    domain.owner.toLowerCase() !== domain.dnsOwner.toLowerCase()
  const outOfSync = dnssecmode && dnssecmode.outOfSync
  const releaseDeed = domain.deedOwner && parseInt(domain.deedOwner, 16) !== 0
  return (
    <>
      <Route
        exact
        path="/name/:name"
        render={() => {
          return (
            <Details data-testid="name-details">
              {isOwner && <SetupName initialState={showExplainer} />}
              {releaseDeed && <ReleaseDeed domain={domain} refetch={refetch} />}
              {parseInt(domain.owner, 16) !== 0 &&
                !loadingIsMigrated &&
                !isMigratedToNewRegistry && (
                  <RegistryMigration
                    account={account}
                    domain={domain}
                    refetchIsMigrated={refetchIsMigrated}
                  />
                )}
              {domain.parent && (
                <DetailsItem uneditable>
                  <DetailsKey>Parent</DetailsKey>
                  <DetailsValue>
                    <Link to={`/name/${domain.parent}`}>{domain.parent}</Link>
                  </DetailsValue>
                </DetailsItem>
              )}
              <OwnerFields outOfSync={outOfSync}>
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
                        <AddressLink address={domain.deedOwner}>
                          <SingleNameBlockies
                            address={domain.deedOwner}
                            imageSize={24}
                          />
                          {domain.deedOwner}
                        </AddressLink>
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
                      <AddressLink address={domain.owner}>
                        {outOfSync ? (
                          <SingleNameBlockies
                            address={domain.owner}
                            imageSize={24}
                            color={'#E1E1E1'}
                            bgcolor={'#FFFFFF'}
                            spotcolor={'#CFCFCF'}
                          />
                        ) : (
                          <SingleNameBlockies
                            address={domain.owner}
                            imageSize={24}
                          />
                        )}
                        <DomainOwnerAddress outOfSync={outOfSync}>
                          {domain.owner}
                        </DomainOwnerAddress>
                      </AddressLink>
                    </DetailsValue>
                    <ButtonContainer outOfSync={outOfSync}>
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
                  // Either subdomain, or .test
                  <DetailsItemEditable
                    domain={domain}
                    keyName="Controller"
                    value={domain.owner}
                    canEdit={isOwner || isOwnerOfParent}
                    deedOwner={domain.deedOwner}
                    isDeedOwner={isDeedOwner}
                    outOfSync={outOfSync}
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
                          <AddressLink address={domain.dnsOwner}>
                            <SingleNameBlockies
                              address={domain.dnsOwner}
                              imageSize={24}
                            />
                            {domain.dnsOwner}
                          </AddressLink>
                        )}
                      </DetailsValue>
                      <ButtonContainer outOfSync={outOfSync}>
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
                    ) : outOfSync ? (
                      <OutOfSyncExplainerContainer>
                        <HR />
                        <OutOfSyncExplainer>
                          <OrangeExclamation />
                          {dnssecmode.explainer}
                          <LinkToLearnMore
                            href="https://docs.ens.domains/dns-registrar-guide"
                            target="_blank"
                            outOfSync={outOfSync}
                          >
                            Learn More{' '}
                            <EtherScanLinkContainer>
                              <ExternalLinkIcon />
                            </EtherScanLinkContainer>
                          </LinkToLearnMore>
                        </OutOfSyncExplainer>
                      </OutOfSyncExplainerContainer>
                    ) : (
                      <Explainer>
                        {dnssecmode.explainer}
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
                {!domain.available ? (
                  domain.isNewRegistrar || domain.gracePeriodEndDate ? (
                    <DetailsItemEditable
                      domain={domain}
                      keyName="Expiration Date"
                      value={domain.expiryTime}
                      notes={
                        domain.gracePeriodEndDate ? (
                          <GracePeriodWarning
                            date={domain.gracePeriodEndDate}
                          />
                        ) : (
                          ''
                        )
                      }
                      canEdit={parseInt(account, 16) !== 0}
                      type="date"
                      editButton="Renew"
                      mutationButton="Renew"
                      mutation={RENEW}
                      refetch={refetch}
                      confirm={true}
                    />
                  ) : domain.expiryTime ? (
                    <DetailsItem uneditable>
                      <DetailsKey>Expiration Date</DetailsKey>
                      <ExpirationDetailsValue
                        isExpired={domain.expiryTime < new Date()}
                      >
                        {formatDate(domain.expiryTime)}
                      </ExpirationDetailsValue>
                    </DetailsItem>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </OwnerFields>
              <HR />
              <ResolverAndRecords
                domain={domain}
                isOwner={isOwner}
                refetch={refetch}
                account={account}
              />
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

      <Route
        exact
        path="/name/:name/register"
        render={() => (
          <NameRegister
            registrationOpen={registrationOpen}
            domain={domain}
            refetch={refetch}
            readOnly={account === EMPTY_ADDRESS}
          />
        )}
      />
    </>
  )
}

export default NameDetails

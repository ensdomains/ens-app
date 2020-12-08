import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useTranslation, Trans } from 'react-i18next'
import styled from '@emotion/styled'
import { Link, Route } from 'react-router-dom'
import mq from 'mediaQuery'

import {
  SET_OWNER,
  SET_SUBNODE_OWNER,
  SET_REGISTRANT,
  RECLAIM,
  RENEW
} from '../../graphql/mutations'
import { IS_MIGRATED } from '../../graphql/queries'

import { formatDate } from '../../utils/dates'
import { isEmptyAddress } from '../../utils/records'

import NameRegister from './NameRegister'
import SubmitProof from './SubmitProof'
import Tooltip from '../Tooltip/Tooltip'
import { HR } from '../Typography/Basic'
import DefaultButton from '../Forms/Button'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DetailsItemEditable from './DetailsItemEditable'
import SetupName from '../SetupName/SetupName'
import { SingleNameBlockies } from '../Blockies'
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
  padding: 20px;
  transition: 0.4s;
  ${mq.small`
    padding: 40px;
  `}
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
  margin-top: 20px;
  height: 50px;
  ${mq.small`
    height: 50px;
    width: 50px;
    position: absolute;
    right: 128px;
    -webkit-transform: translate(0, -65%);
    -ms-transform: translate(0, -65%);
    transform: translate(0, -65%);
  `}
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
  margin-left: 0px;
  ${mq.small`
    margin-left: 180px;
  `}

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
  margin-right: ${props => (props.outOfSync ? '' : '')};
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
  background: ${p => (p.isExpired ? '#ff926f' : '#fef7e9')};
  padding: 10px 20px;
  margin: 5px 0px;
`

const GracePeriodText = styled('span')`
  color: ${p => (p.isExpired ? 'white' : '#cacaca')};
  margin-left: 0.5em;
`

const GracePeriodDate = styled('span')`
  font-weight: bold;
`

const Expiration = styled('span')`
  color: ${p => (p.isExpired ? 'white' : '#f5a623')};
  font-weight: bold;
`

const GracePeriodWarning = ({ date, expiryTime }) => {
  let { t } = useTranslation()
  let isExpired = new Date() > new Date(expiryTime)
  return (
    <GracePeriodWarningContainer isExpired={isExpired}>
      <Expiration isExpired={isExpired}>
        {isExpired
          ? t('singleName.expiry.expired')
          : t('singleName.expiry.expiringSoon')}
      </Expiration>
      <GracePeriodText isExpired={isExpired}>
        {t('singleName.expiry.gracePeriodEnds')}{' '}
        <GracePeriodDate>{formatDate(date)}</GracePeriodDate>
      </GracePeriodText>
    </GracePeriodWarningContainer>
  )
}

function canClaim(domain) {
  if (!domain.name.match(/\.test$/)) return false
  return parseInt(domain.owner) === 0 || domain.expiryTime < new Date()
}

function DetailsContainer({
  isMigratedToNewRegistry,
  isDeedOwner,
  isRegistrant,
  showExplainer,
  canSubmit,
  outOfSync,
  releaseDeed,
  loading,
  setLoading,
  isOwnerOfParent,
  isOwner,
  refetch,
  domain,
  dnssecmode,
  account,
  loadingIsMigrated,
  refetchIsMigrated,
  isParentMigratedToNewRegistry,
  loadingIsParentMigrated
}) {
  const { t } = useTranslation()
  const isExpired = domain.expiryTime < new Date()
  const domainOwner =
    domain.available || domain.owner === '0x0' ? null : domain.owner
  const registrant =
    domain.available || domain.registrant === '0x0' ? null : domain.registrant

  const domainParent =
    domain.name === '[root]' ? null : domain.parent ? domain.parent : '[root]'

  return (
    <Details data-testid="name-details">
      {isOwner && <SetupName initialState={showExplainer} />}
      {isMigratedToNewRegistry && releaseDeed && (
        <ReleaseDeed domain={domain} isDeedOwner={isDeedOwner} />
      )}
      {parseInt(domain.owner, 16) !== 0 &&
        !loadingIsMigrated &&
        !isMigratedToNewRegistry && (
          <RegistryMigration
            account={account}
            domain={domain}
            dnssecmode={dnssecmode}
            refetchIsMigrated={refetchIsMigrated}
            isParentMigratedToNewRegistry={isParentMigratedToNewRegistry}
            loadingIsParentMigrated={loadingIsParentMigrated}
          />
        )}
      {domainParent ? (
        <DetailsItem uneditable>
          <DetailsKey>{t('c.parent')}</DetailsKey>
          <DetailsValue>
            <Link to={`/name/${domainParent}`}>{domainParent}</Link>
          </DetailsValue>
        </DetailsItem>
      ) : (
        ''
      )}
      <OwnerFields outOfSync={outOfSync}>
        {domain.parent === 'eth' && domain.isNewRegistrar ? (
          <>
            <DetailsItemEditable
              domain={domain}
              keyName="registrant"
              value={registrant}
              canEdit={isRegistrant && !isExpired}
              isExpiredRegistrant={isRegistrant && isExpired}
              type="address"
              editButton={t('c.transfer')}
              mutationButton={t('c.transfer')}
              mutation={SET_REGISTRANT}
              refetch={refetch}
              confirm={true}
              copyToClipboard={true}
            />
            <DetailsItemEditable
              domain={domain}
              keyName="Controller"
              value={domainOwner}
              canEdit={isRegistrant || (isOwner && isMigratedToNewRegistry)}
              deedOwner={domain.deedOwner}
              isDeedOwner={isDeedOwner}
              type="address"
              editButton={isRegistrant ? t('c.set') : t('c.transfer')}
              mutationButton={isRegistrant ? t('c.set') : t('c.transfer')}
              mutation={isRegistrant ? RECLAIM : SET_OWNER}
              refetch={refetch}
              confirm={true}
              copyToClipboard={true}
            />
          </>
        ) : domain.parent === 'eth' && !domain.isNewRegistrar ? (
          <>
            <DetailsItem uneditable>
              <DetailsKey>{t('c.registrant')}</DetailsKey>
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
              canEdit={isRegistrant || (isOwner && isMigratedToNewRegistry)}
              deedOwner={domain.deedOwner}
              isDeedOwner={isDeedOwner}
              type="address"
              editButton={isRegistrant ? t('c.set') : t('c.transfer')}
              mutationButton={isRegistrant ? t('c.set') : t('c.transfer')}
              mutation={isRegistrant ? RECLAIM : SET_OWNER}
              refetch={refetch}
              confirm={true}
              copyToClipboard={true}
            />
          </>
        ) : domain.isDNSRegistrar ? (
          <DetailsItem uneditable>
            <DetailsKey>
              {t('c.Controller')} {isOwner ? <You /> : ''}
            </DetailsKey>
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
                  <SingleNameBlockies address={domain.owner} imageSize={24} />
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
                  actionText={t('c.sync')}
                />
              ) : (
                <Tooltip
                  text={t(
                    'singleName.tooltips.detailsItem.ControllerAndDnsAlreadySync'
                  )}
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
                        {t('c.sync')}
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
            canEdit={(isOwner || isOwnerOfParent) && isMigratedToNewRegistry}
            deedOwner={domain.deedOwner}
            isDeedOwner={isDeedOwner}
            outOfSync={outOfSync}
            type="address"
            editButton={isOwnerOfParent ? t('c.set') : t('c.transfer')}
            mutationButton={isOwnerOfParent ? t('c.set') : t('c.transfer')}
            mutation={isOwnerOfParent ? SET_SUBNODE_OWNER : SET_OWNER}
            refetch={refetch}
            confirm={true}
            copyToClipboard={true}
          />
        )}
        {/* To be replaced with a logic a function to detect dnsregistrar */}
        {domain.isDNSRegistrar ? (
          <>
            <DetailsItem uneditable>
              <DetailsKey>{t('dns.dnsowner')}</DetailsKey>
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
                    {t('c.refresh')}{' '}
                  </Button>
                )}
              </ButtonContainer>
            </DetailsItem>
            {dnssecmode.displayError ? (
              <ErrorExplainer>
                <OrangeExclamation />
                {t('singleName.dns.messages.error')}
                <LinkToLearnMore
                  href="https://docs.ens.domains/dns-registrar-guide"
                  target="_blank"
                >
                  {t('c.learnmore')}{' '}
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
                  <Trans i18nKey={'singleName.dns.messages.outOfSync'}>
                    {dnssecmode.explainer}
                  </Trans>
                  <LinkToLearnMore
                    href="https://docs.ens.domains/dns-registrar-guide"
                    target="_blank"
                    outOfSync={outOfSync}
                  >
                    {t('c.learnmore')}{' '}
                    <EtherScanLinkContainer>
                      <ExternalLinkIcon />
                    </EtherScanLinkContainer>
                  </LinkToLearnMore>
                </OutOfSyncExplainer>
              </OutOfSyncExplainerContainer>
            ) : (
              <Explainer>
                <Trans i18nKey={'singleName.dns.messages.readyToRegister'}>
                  {dnssecmode.explainer}
                </Trans>
                <LinkToLearnMore
                  href="https://docs.ens.domains/dns-registrar-guide"
                  target="_blank"
                >
                  {t('c.learnmore')}{' '}
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
            <DetailsKey>{t('c.registrationDate')}</DetailsKey>
            <DetailsValue>{formatDate(domain.registrationDate)}</DetailsValue>
          </DetailsItem>
        ) : (
          ''
        )}
        {!domain.available ? (
          domain.isNewRegistrar || domain.gracePeriodEndDate ? (
            <>
              <DetailsItemEditable
                domain={domain}
                keyName="Expiration Date"
                value={domain.expiryTime}
                canEdit={parseInt(account, 16) !== 0}
                type="date"
                editButton={t('c.renew')}
                mutationButton={t('c.renew')}
                mutation={RENEW}
                refetch={refetch}
                confirm={true}
              />
              {domain.gracePeriodEndDate ? (
                <GracePeriodWarning
                  expiryTime={domain.expiryTime}
                  date={domain.gracePeriodEndDate}
                />
              ) : (
                ''
              )}
            </>
          ) : domain.expiryTime ? (
            <DetailsItem uneditable>
              <DetailsKey>{t("c['Expiration Date']")}</DetailsKey>
              <ExpirationDetailsValue isExpired={isExpired}>
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
        isMigratedToNewRegistry={isMigratedToNewRegistry}
      />
      {canClaim(domain) ? (
        <NameClaimTestDomain domain={domain} refetch={refetch} />
      ) : null}
    </Details>
  )
}
function NameDetails({
  domain,
  isOwner,
  isOwnerOfParent,
  refetch,
  account,
  registrationOpen,
  tab,
  pathname
}) {
  const [loading, setLoading] = useState(undefined)
  const {
    data: { isMigrated } = {},
    loading: loadingIsMigrated,
    refetch: refetchIsMigrated
  } = useQuery(IS_MIGRATED, {
    variables: {
      name: domain.name
    }
  })

  const {
    data: { isMigrated: isParentMigrated } = {},
    loading: loadingIsParentMigrated
  } = useQuery(IS_MIGRATED, {
    variables: {
      name: domain.parent
    }
  })
  const isLoggedIn = parseInt(account) !== 0
  const isMigratedToNewRegistry = !loadingIsMigrated && isMigrated
  const isParentMigratedToNewRegistry = isParentMigrated

  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = !domain.available && domain.registrant === account
  let dnssecmode, canSubmit
  if ([5, 6].includes(domain.state) && !isMigrated) {
    dnssecmode = dnssecmodes[7]
    canSubmit =
      isLoggedIn && domain.isDNSRegistrar && dnssecmode.state === 'SUBMIT_PROOF'
  } else {
    dnssecmode = dnssecmodes[domain.state]
    canSubmit =
      isLoggedIn &&
      domain.isDNSRegistrar &&
      dnssecmode.state === 'SUBMIT_PROOF' && // This is for not allowing the case user does not have record rather than having empty address record.
      domain.owner.toLowerCase() !== domain.dnsOwner.toLowerCase()
  }
  const showExplainer = !parseInt(domain.resolver)
  const outOfSync = dnssecmode && dnssecmode.outOfSync
  const releaseDeed = domain.deedOwner && parseInt(domain.deedOwner, 16) !== 0
  const isAnAbsolutePath = pathname.split('/').length > 3

  if (domain.parent === 'eth' && tab === 'register' && !isAnAbsolutePath) {
    return (
      <NameRegister
        registrationOpen={registrationOpen}
        domain={domain}
        refetch={refetch}
        refetchIsMigrated={refetchIsMigrated}
        readOnly={isEmptyAddress(account)}
      />
    )
  } else if (
    domain.parent === 'eth' &&
    tab === 'details' &&
    !isAnAbsolutePath
  ) {
    return (
      <DetailsContainer
        isMigratedToNewRegistry={isMigratedToNewRegistry}
        loadingIsMigrated={loadingIsMigrated}
        refetchIsMigrated={refetchIsMigrated}
        isParentMigratedToNewRegistry={isParentMigratedToNewRegistry}
        loadingIsParentMigrated={loadingIsParentMigrated}
        isDeedOwner={isDeedOwner}
        isRegistrant={isRegistrant}
        showExplainer={showExplainer}
        canSubmit={canSubmit}
        outOfSync={outOfSync}
        releaseDeed={releaseDeed}
        loading={loading}
        setLoading={setLoading}
        isOwnerOfParent={isOwnerOfParent}
        isOwner={isOwner}
        refetch={refetch}
        domain={domain}
        dnssecmode={dnssecmode}
        account={account}
      />
    )
  } else if (domain.parent !== 'eth' && !isAnAbsolutePath) {
    //subdomain or dns
    return (
      <DetailsContainer
        isMigratedToNewRegistry={isMigratedToNewRegistry}
        loadingIsMigrated={loadingIsMigrated}
        refetchIsMigrated={refetchIsMigrated}
        isParentMigratedToNewRegistry={isParentMigratedToNewRegistry}
        loadingIsParentMigrated={loadingIsParentMigrated}
        isDeedOwner={isDeedOwner}
        isRegistrant={isRegistrant}
        showExplainer={showExplainer}
        canSubmit={canSubmit}
        outOfSync={outOfSync}
        releaseDeed={releaseDeed}
        loading={loading}
        setLoading={setLoading}
        isOwnerOfParent={isOwnerOfParent}
        isOwner={isOwner}
        refetch={refetch}
        domain={domain}
        dnssecmode={dnssecmode}
        account={account}
      />
    )
  }

  return (
    <>
      <Route
        path="/name/:name/details"
        render={() => {
          return (
            <DetailsContainer
              isMigratedToNewRegistry={isMigratedToNewRegistry}
              isDeedOwner={isDeedOwner}
              isRegistrant={isRegistrant}
              showExplainer={showExplainer}
              canSubmit={canSubmit}
              outOfSync={outOfSync}
              releaseDeed={releaseDeed}
              loading={loading}
              setLoading={setLoading}
              isOwnerOfParent={isOwnerOfParent}
              isParentMigratedToNewRegistry={isParentMigratedToNewRegistry}
              loadingIsParentMigrated={loadingIsParentMigrated}
              isOwner={isOwner}
              refetch={refetch}
              domain={domain}
              dnssecmode={dnssecmode}
              account={account}
            />
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
            isMigratedToNewRegistry={isMigratedToNewRegistry}
            loadingIsMigrated={loadingIsMigrated}
            isParentMigratedToNewRegistry={isParentMigratedToNewRegistry}
            loadingIsParentMigrated={loadingIsParentMigrated}
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
            refetchIsMigrated={refetchIsMigrated}
            readOnly={isEmptyAddress(account)}
          />
        )}
      />
    </>
  )
}

export default NameDetails

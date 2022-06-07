import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Route, Redirect } from 'react-router-dom'

import { IS_MIGRATED } from '../../graphql/queries'

import NameRegister from './NameRegister'
import SubDomains from './SubDomains'
import dnssecmodes from '../../api/dnssecmodes'
import DetailsContainer from './DetailsContainer'

function NameDetails({
  domain,
  isOwner,
  isOwnerOfParent,
  refetch,
  account,
  registrationOpen,
  tab,
  pathname,
  isNameWrapped = false,
  isReadOnly = true
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
  const pathnamewithoutslash = pathname.replace(/\/$/, '')
  const needRedirect = !pathnamewithoutslash.match(
    '/register$|/details$|/subdomains$'
  )
  if (needRedirect) {
    return <Redirect to={`${pathnamewithoutslash}/${tab}`} />
  }

  return (
    <>
      <Route
        path="/name/:name/details"
        render={() => {
          return (
            <DetailsContainer
              loadingIsMigrated={loadingIsMigrated}
              isMigratedToNewRegistry={isMigratedToNewRegistry}
              isDeedOwner={isDeedOwner}
              isRegistrant={isRegistrant}
              showExplainer={showExplainer}
              canSubmit={canSubmit}
              outOfSync={outOfSync}
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
              refetchIsMigrated={refetchIsMigrated}
              readOnly={isNameWrapped}
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
            readOnly={isNameWrapped}
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
            isNameWrapped={isNameWrapped}
            isReadOnly={isReadOnly}
          />
        )}
      />
    </>
  )
}

export default NameDetails

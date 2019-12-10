import React from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { CAN_WRITE } from 'graphql/queries'
import { MIGRATE_REGISTRY } from 'graphql/mutations'
import styled from '@emotion/styled'
import { ExternalButtonLink } from '../Forms/Button'

const WarningBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
  color: #2b2b2b;
  padding: 20px 35px;
  background: hsla(37, 91%, 55%, 0.1);
  margin-bottom: 20px;
`

const WarningContent = styled('div')`
  width: calc(100% - 120px);
  padding-right: 20px;
`

const SubWarning = styled('p')`
  font-size: 14px;
  color: #2b2b2b;
  font-weight: 500;
`

const Migrate = styled(ExternalButtonLink)`
  flex: 2 1 auto;
`

export default function MigrationWarning({ domain, account }) {
  const { data, loading } = useQuery(CAN_WRITE, { variables: { account } })
  const [mutation] = useMutation(MIGRATE_REGISTRY, {
    variables: { name: domain.name }
  })
  const canMigrate = account === domain.parentOwner
  return (
    <WarningBox>
      <WarningContent>
        This name needs to be migrated to the new Registry. Only the parent of
        the TLD can do this.
        <SubWarning>
          *If you trade ENS names, do not accept this name!
        </SubWarning>
      </WarningContent>
      <Migrate
        onClick={canMigrate ? mutation : () => {}}
        type={canMigrate ? 'hollow-primary' : 'hollow-primary-disabled'}
        href="#"
      >
        Migrate
      </Migrate>
    </WarningBox>
  )
}

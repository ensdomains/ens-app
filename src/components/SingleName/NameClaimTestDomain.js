import React from 'react'
import styled from 'react-emotion'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'
import Button from '../Forms/Button'
import { useEditable } from '../hooks'
import PendingTx from '../PendingTx'
import mq from 'mediaQuery'

const NameClaimTestDomainContainer = styled('div')`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${mq.medium`
    flex-direction: row-reverse;
  `};
  border-top: 1px dashed #d3d3d3;
`
const ClaimButton = styled(Button)`
  max-width: 8em;
`

const Note = styled('p')`
  color: #c7d3e3;
  size: 14pt;
`

const Tld = styled('pre')`
  display: inline;
  background-color: #eee;
  padding: 3px;
`

function NameClaimTestDomain({ domain, refetch }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state

  const { startPending, setConfirmed } = actions

  return (
    <NameClaimTestDomainContainer>
      {pending && !confirmed ? (
        <PendingTx
          txHash={txHash}
          setConfirmed={setConfirmed}
          onCompleted={refetch}
        />
      ) : (
        <Mutation
          mutation={REGISTER_TESTDOMAIN}
          onCompleted={data => {
            startPending(Object.values(data)[0])
            refetch()
          }}
        >
          {mutation => (
            <ClaimButton
              onClick={() => {
                mutation({
                  variables: {
                    label: domain.label
                  }
                })
              }}
            >
              Claim
            </ClaimButton>
          )}
        </Mutation>
      )}
      <Note>
        Note: <Tld>.test</Tld> domain allows anyone to claim an unused name for
        test purposes, which expires after 28 days
      </Note>
    </NameClaimTestDomainContainer>
  )
}
export default NameClaimTestDomain

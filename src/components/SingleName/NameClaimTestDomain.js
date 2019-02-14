import React from 'react'
import styled from 'react-emotion'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'
import Button from '../Forms/Button'
import { useEditable } from '../hooks'
import PendingTx from '../PendingTx'

const NameClaimTestDomainContainer = styled('div')`
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-top: 1px dashed #d3d3d3
`      

const Note = styled('p')`
`

function NameClaimTestDomain({domain, refetch}){
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state

  const {
    startPending,
    setConfirmed
  } = actions

  return(
    <NameClaimTestDomainContainer>
      {pending && !confirmed ? (
        <PendingTx
          txHash={txHash}
          setConfirmed={setConfirmed}
          refetch={refetch}
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
          <Button
            onClick={() => {
              mutation({
                variables: {
                  label: domain.label
                }
              })
            }}
          >
          Claim the test domain
          </Button>
        )}
        </Mutation>
      )}
      <Note>Note: <tld></tld>.test domain allows anyone to claim an unused name for test purposes, which expires after 28 days</Note>
    </NameClaimTestDomainContainer>
  )
}
export default NameClaimTestDomain

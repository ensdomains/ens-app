import React from 'react'
<<<<<<< HEAD
import styled from '@emotion/styled'
=======
import styled from 'react-emotion'
>>>>>>> dev
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
<<<<<<< HEAD
  ${mq.medium`
    flex-direction: row-reverse;
  `};
  border-top: 1px dashed #d3d3d3;
`
=======
  align-items: center;
  ${mq.medium`
    flex-direction: row-reverse;
  `};
  border-top: 1px dashed #d3d3d3
`      
>>>>>>> dev
const ClaimButton = styled(Button)`
  max-width: 8em;
`

const Note = styled('p')`
<<<<<<< HEAD
  color: #c7d3e3;
=======
  color: #C7D3E3;
>>>>>>> dev
  size: 14pt;
`

const Tld = styled('pre')`
<<<<<<< HEAD
  display: inline;
=======
  display:inline;
>>>>>>> dev
  background-color: #eee;
  padding: 3px;
`

<<<<<<< HEAD
function NameClaimTestDomain({ domain, refetch }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state

  const { startPending, setConfirmed } = actions

  return (
=======
function NameClaimTestDomain({domain, refetch}){
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state

  const {
    startPending,
    setConfirmed
  } = actions

  return(
>>>>>>> dev
    <NameClaimTestDomainContainer>
      {pending && !confirmed ? (
        <PendingTx
          txHash={txHash}
<<<<<<< HEAD
          onConfirmed={() => {
            setConfirmed()
            refetch()
          }}
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
=======
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
      <Note>Note: <Tld>.test</Tld> domain allows anyone to claim an unused name for test purposes, which expires after 28 days</Note>
>>>>>>> dev
    </NameClaimTestDomainContainer>
  )
}
export default NameClaimTestDomain

import React from 'react'
import styled from 'react-emotion'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'
import Button from '../Forms/Button'

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
  return(
    <NameClaimTestDomainContainer>
      <Mutation
        mutation={REGISTER_TESTDOMAIN}
        onCompleted={data => {
          // startPending(Object.values(data)[0])
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
          }
            // toggleModal({
            //   name: 'confirm',
            //   mutation: mutation,
            //   mutationButton: mutationButton,
            //   value: value,
            //   newValue: newValue,
            //   cancel: () => {
            //     toggleModal({ name: 'confirm' })
            //   }
            // })
          }
        >
        Claim the test domain
        </Button>
      )}
      </Mutation>
      <Note>Note: <tld></tld>.test domain allows anyone to claim an unused name for test purposes, which expires after 28 days</Note>
    </NameClaimTestDomainContainer>
  )
}
export default NameClaimTestDomain

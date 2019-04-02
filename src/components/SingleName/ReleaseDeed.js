import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'

import { useEditable } from '../hooks'
import mq from 'mediaQuery'
import { RELEASE_DEED } from '../../graphql/mutations'

import { DetailsItem } from './DetailsItem'
import Button from '../Forms/Button'
import PendingTx from '../PendingTx'

const ReleaseButton = styled(Button)`
  width: 130px;
`

const ReleaseInstruction = styled('h3')`
  margin: 0;
  margin-bottom: 0px;
  font-family: Overpass;
  font-size: 18px;
  font-weight: 300;
  color: #2b2b2b;
  ${mq.small`
      font-size: 20px;
  `}
`

const ReleaseExplanation = styled('p')`
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  margin-bottom: 20px;

  strong {
    font-weight: 700;
    text-decoration: underline;
  }

  ${mq.small`
    margin: 0;
  `}
`

const ReleaseDetail = styled(DetailsItem)`
  padding: 20px;
  background-color: #f0f6fa;
  position: relative;
  padding-top: 65px;
  margin-bottom: 25px;

  ${mq.small`
    padding-top: 20px;
    padding-right: 150px;
    padding-left: 75px;
    margin-bottom: 25px;
  `}
`

const Action = styled('div')`
  margin-bottom: 1em;
  ${mq.small`
    margin-top: 0;
    position: absolute;
    top: 68%;
    right:30px;
    transform: translate(0, -65%);
  `}
`

function ReleaseDeed({
  label,
  refetch
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions  

  return (
    <ReleaseDetail>
      <ReleaseInstruction>
        Release your name to get your locked ETH back.
      </ReleaseInstruction>
      <ReleaseExplanation>
        You will no longer have ownership of this name
      </ReleaseExplanation>
      <Action>
        {pending && !confirmed && txHash ? (
          <PendingTx
            txHash={txHash}
            onConfirmed={() => {
              setConfirmed()
              refetch()
            }}
          />
        ) : (
          <Mutation
            mutation={RELEASE_DEED}
            variables={{ label }}
            onCompleted={data => {
              startPending(Object.values(data)[0])
            }}
          >
            {mutate => <ReleaseButton
                        onClick={mutate}
                        type="primary"
                      >Release</ReleaseButton>
            }
          </Mutation>
        )}
      </Action>
    </ReleaseDetail>
  )
}

export default ReleaseDeed

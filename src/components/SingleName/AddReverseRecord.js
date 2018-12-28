import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { SET_NAME } from '../../graphql/mutations'
import mq from 'mediaQuery'

import ReverseRecordQuery from '../ReverseRecordQuery'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import PendingTx from '../PendingTx'

import { ReactComponent as DefaultCheck } from '../Icons/Check.svg'
import { ReactComponent as DefaultBlueWarning } from '../Icons/BlueWarning.svg'
import { ReactComponent as DefaultSmallCaret } from '../Icons/SmallCaret.svg'

const AddReverseRecordContainer = styled('div')`
  background: #f0f6fa;
  border: 1px solid #ededed;
  border-radius: 8px;
  margin-top: 20px;
  padding: 10px 15px;
`

const SetReverseContainer = styled('div')`
  margin-top: 15px;
  padding: 10px;
`

const Message = styled('div')`
  font-family: Overpass Mono;
  font-weight: 700;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`

const MessageContent = styled('div')`
  display: flex;
  align-items: center;
`

const IconStyles = () => `margin-right: 10px;
  flex-shrink: 0;
`

const BlueWarning = styled(DefaultBlueWarning)`
  ${IconStyles()};
`

const Check = styled(DefaultCheck)`
  ${IconStyles()};
`

const SmallCaret = styled(DefaultSmallCaret)`
  flex-shrink: 0;
  transform: ${p => (p.rotated ? 'rotate(0)' : 'rotate(-90deg)')};
`

const Explanation = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  line-height: 25px;
  margin-bottom: 10px;
  max-width: 768px;
  hyphens: auto;
`

const Account = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  border: 1px dashed #adbbcd;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
  whitespace: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${mq.small`
    font-size: 18px;
  `}
`

const Name = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  border: 1px dashed #2b2b2b;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
  ${mq.small`
    font-size: 18px;
  `}
`

class AddReverseRecord extends Component {
  render() {
    const { account, name } = this.props
    return (
      <AddReverseRecordContainer>
        <Editable>
          {({
            editing,
            txHash,
            startEditing,
            stopEditing,
            startPending,
            pending,
            confirmed,
            setConfirmed
          }) => (
            <ReverseRecordQuery address={account}>
              {({ data: { getReverseRecord }, loading, refetch }) => {
                if (loading) return 'loading'
                return (
                  <>
                    <Message onClick={editing ? stopEditing : startEditing}>
                      {getReverseRecord ? (
                        name === getReverseRecord.name ? (
                          <MessageContent>
                            <Check />
                            Reverse record: Set to {name}
                          </MessageContent>
                        ) : (
                          <MessageContent>
                            <BlueWarning />
                            Reverse record: Set to a different name:
                            {getReverseRecord.name}
                          </MessageContent>
                        )
                      ) : (
                        `Reverse record: not set`
                      )}
                      {pending && !confirmed && txHash ? (
                        <PendingTx
                          txHash={txHash}
                          setConfirmed={setConfirmed}
                        /> 
                      ) : (
                        <SmallCaret
                          rotated={editing}
                          data-testid="small-caret"
                        />
                      )}
                    </Message>
                    {editing && (
                      <SetReverseContainer>
                        <Explanation>
                          The Reverse Resolution translates an address into a
                          name. It allows Dapps to show in their interfaces “
                          {name}” rather than the long address “{account}
                          ”. If you would like to set up your reverse for a
                          different account, please switch accounts in your dapp
                          browser.
                        </Explanation>
                        <Account>{account}</Account>
                        <Name>{name}</Name>
                        <Mutation
                          mutation={SET_NAME}
                          variables={{
                            name
                          }}
                          onCompleted={data => {
                            startPending(Object.values(data)[0])
                            refetch()
                          }}
                        >
                          {mutation => (
                            <SaveCancel
                              mutation={mutation}
                              stopEditing={stopEditing}
                            />
                          )}
                        </Mutation>
                      </SetReverseContainer>
                    )}
                  </>
                )
              }}
            </ReverseRecordQuery>
          )}
        </Editable>
      </AddReverseRecordContainer>
    )
  }
}

export default AddReverseRecord

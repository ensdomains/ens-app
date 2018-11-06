import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { SET_NAME } from '../../graphql/mutations'

import ReverseRecordQuery from '../ReverseRecordQuery'
import Editable from './Editable'
import SaveCancel from './SaveCancel'

import { ReactComponent as DefaultCheck } from '../Icons/Check.svg'
import { ReactComponent as DefaultBlueWarning } from '../Icons/BlueWarning.svg'

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

  &:hover {
    cursor: pointer;
  }
`

const IconStyles = () => `margin-right: 10px;`

const BlueWarning = styled(DefaultBlueWarning)`
  ${IconStyles()};
`

const Check = styled(DefaultCheck)`
  ${IconStyles()};
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
`

const Account = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 18px;
  color: #adbbcd;
  letter-spacing: 0;
  border: 1px dashed #adbbcd;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
`

const Name = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 18px;
  color: #2b2b2b;
  letter-spacing: 0;
  border: 1px dashed #2b2b2b;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
`

class AddReverseRecord extends Component {
  render() {
    const { account, name } = this.props
    return (
      <AddReverseRecordContainer>
        <Editable>
          {({ editing, startEditing, stopEditing }) => (
            <ReverseRecordQuery address={account}>
              {({ data: { getReverseRecord }, loading }) => {
                if (loading) return 'loading'
                return (
                  <>
                    <Message onClick={editing ? stopEditing : startEditing}>
                      {getReverseRecord ? (
                        name === getReverseRecord.name ? (
                          <>
                            <Check />
                            Reverse record: Set to {name}
                          </>
                        ) : (
                          <>
                            <BlueWarning />
                            <div>
                              {`Set to a different name: ${
                                getReverseRecord.name
                              } 
                          `}
                            </div>
                          </>
                        )
                      ) : (
                        `Reverse record: not set`
                      )}
                    </Message>
                    {editing && (
                      <SetReverseContainer>
                        <Explanation>
                          The Reverse Resolution translates an address into a
                          name. It allows Dapps to show in their interfaces “
                          {name}” rather than the long address “{account}
                          ”.{' '}
                        </Explanation>
                        <Account>{account}</Account>
                        <Name>{name}</Name>
                        <Mutation
                          mutation={SET_NAME}
                          variables={{
                            name
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

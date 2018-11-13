import React, { Fragment, Component } from 'react'
import styled from 'react-emotion'
import { Link, Route } from 'react-router-dom'
import { Query } from 'react-apollo'

import { GET_PUBLIC_RESOLVER } from '../../graphql/queries'

import { HR } from '../Typography/Basic'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import RecordsItem from './RecordsItem'
import DetailsItemEditable from './DetailsItemEditable'
import AddRecord from './AddRecord'
import GlobalState from '../../globalState'
import Button from '../../components/Forms/Button'

import {
  SET_OWNER,
  SET_RESOLVER,
  SET_ADDRESS,
  SET_CONTENT
} from '../../graphql/mutations'

import { formatDate } from '../../utils/dates'

const Details = styled('section')`
  padding: 40px;
  transition: 0.4s;
`

const Records = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  padding-bottom: ${p => (p.hasRecord ? '10px' : '0')};
  display: ${p => (!p.isOwner && !p.hasRecord ? 'none' : 'block')};
`

class NameDetails extends Component {
  isEmpty(record) {
    if (parseInt(record, 16) === 0) {
      return true
    }
    if (record === '0x') {
      return true
    }

    return false
  }
  hasAnyRecord(domain) {
    if (parseInt(domain.resolver, 16) === 0) {
      return false
    }
    if (!this.isEmpty(domain.addr)) {
      return true
    }

    if (!this.isEmpty(domain.content)) {
      return true
    }
  }
  render() {
    const { domain, isOwner, refetch, account } = this.props
    const records = [
      {
        label: 'Address',
        value: 'address'
      },
      {
        label: 'Content',
        value: 'content'
      }
    ]

    const emptyRecords = records.filter(record => {
      if (record.value === 'address') {
        return this.isEmpty(domain['addr']) ? true : false
      }

      return this.isEmpty(domain[record.value]) ? true : false
    })

    return (
      <Fragment>
        <Route
          exact
          path="/name/:name"
          render={() => (
            <Details>
              {domain.parent && (
                <DetailsItem>
                  <DetailsKey>Parent</DetailsKey>
                  <DetailsValue>
                    <Link to={`/name/${domain.parent}`}>{domain.parent}</Link>
                  </DetailsValue>
                </DetailsItem>
              )}
              <DetailsItemEditable
                domain={domain}
                keyName="Owner"
                value={domain.owner}
                isOwner={isOwner}
                type="address"
                editButton="Transfer"
                mutationButton="Transfer"
                mutation={SET_OWNER}
                mutationName="setOwner"
                event="Transfer"
                refetch={refetch}
              />
              {domain.registrationDate ? (
                <DetailsItem>
                  <DetailsKey>Registration Date</DetailsKey>
                  <DetailsValue>
                    {formatDate(domain.registrationDate)}
                  </DetailsValue>
                </DetailsItem>
              ) : (
                ''
              )}
              <HR />
              <Query query={GET_PUBLIC_RESOLVER}>
                {({ data, loading }) => {
                  if (loading) return null
                  return (
                    <DetailsItemEditable
                      keyName="Resolver"
                      type="address"
                      value={domain.resolver}
                      publicResolver={data.publicResolver}
                      isOwner={isOwner}
                      domain={domain}
                      mutationButton="Save"
                      mutation={SET_RESOLVER}
                      mutationName="setResolver"
                      event="NewResolver"
                      refetch={refetch}
                      account={account}
                    />
                  )
                }}
              </Query>
              <Records hasRecord={this.hasAnyRecord(domain)} isOwner={isOwner}>
                <AddRecord
                  emptyRecords={emptyRecords}
                  title="Records"
                  isOwner={isOwner}
                  domain={domain}
                  resolver={domain.resolver}
                  refetch={refetch}
                />
                {this.hasAnyRecord(domain) && (
                  <>
                    {!this.isEmpty(domain.addr) && (
                      <RecordsItem
                        domain={domain}
                        resolver={domain.resolver}
                        isOwner={isOwner}
                        keyName="Address"
                        value={domain.addr}
                        mutation={SET_ADDRESS}
                        mutationName="setAddress"
                        type="address"
                        event="AddrChanged"
                        refetch={refetch}
                        account={account}
                      />
                    )}
                    {!this.isEmpty(domain.content) && (
                      <RecordsItem
                        domain={domain}
                        resolver={domain.resolver}
                        isOwner={isOwner}
                        keyName="Content"
                        mutation={SET_CONTENT}
                        mutationName="setContent"
                        value={domain.content}
                        event="ContentChanged"
                        refetch={refetch}
                      />
                    )}
                  </>
                )}
              </Records>
              <GlobalState.Consumer>
                {({ toggleModal }) => (
                  <Button
                    onClick={() => toggleModal({
                      name: 'confirm',
                      mutation:() => { alert('somehow have to pass mutation')  },
                      mutationButton:'Transfer',
                      cancel:() => { toggleModal({name:'confirm'})  }
                    })}
                  >
                    Confirm
                  </Button>
                )}
              </GlobalState.Consumer>
            </Details>
          )}
        />

        <Route
          exact
          path="/name/:name/subdomains"
          render={() => <SubDomains domain={domain} isOwner={isOwner} />}
        />
      </Fragment>
    )
  }
}
export default NameDetails

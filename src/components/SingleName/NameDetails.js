import React, { Fragment, Component } from 'react'
import styled from 'react-emotion'
import { Link, Route } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'

import { HR } from '../Typography/Basic'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import RecordsItem from './RecordsItem'
import DetailsItemEditable from './DetailsItemEditable'
import AddRecord from './AddRecord'
import Button from '../Forms/Button'

import {
  SET_OWNER,
  SET_RESOLVER,
  SET_ADDRESS,
  SET_CONTENT,
  SET_CONTENTHASH
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
    if (!record) {
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

    let contentMutation
    if(domain.contentType === 'oldcontent'){
      contentMutation = SET_CONTENT
    }else{
      contentMutation = SET_CONTENTHASH
    }

    return (
      <Fragment>
        <Route
          exact
          path="/name/:name"
          render={() => (
            <Details data-testid="name-details">
              {domain.parent && (
                <DetailsItem uneditable>
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
                refetch={refetch}
                confirm={true}
              />
              {domain.registrationDate ? (
                <DetailsItem uneditable>
                  <DetailsKey>Registration Date</DetailsKey>
                  <DetailsValue>
                    {formatDate(domain.registrationDate)}
                  </DetailsValue>
                </DetailsItem>
              ) : (
                ''
              )}
              <HR />
              <DetailsItemEditable
                keyName="Resolver"
                type="address"
                value={domain.resolver}
                isOwner={isOwner}
                domain={domain}
                editButton="Set"
                mutationButton="Save"
                mutation={SET_RESOLVER}
                refetch={refetch}
                account={account}
              />
              <Records hasRecord={this.hasAnyRecord(domain)} isOwner={isOwner}>
                <AddRecord
                  emptyRecords={emptyRecords}
                  title="Records"
                  isOwner={isOwner}
                  domain={domain}
                  refetch={refetch}
                />
                {this.hasAnyRecord(domain) && (
                  <>
                    {!this.isEmpty(domain.addr) && (
                      <RecordsItem
                        domain={domain}
                        isOwner={isOwner}
                        keyName="Address"
                        value={domain.addr}
                        mutation={SET_ADDRESS}
                        type="address"
                        refetch={refetch}
                        account={account}
                      />
                    )}
                    {!this.isEmpty(domain.content) && (
                      <RecordsItem
                        domain={domain}
                        isOwner={isOwner}
                        keyName="Content"
                        type="content"
                        mutation={contentMutation}
                        value={domain.content}
                        refetch={refetch}
                      />
                    )}
                  </>
                )}
              </Records>
              <div>hello</div>
              {parseInt(domain.owner) == 0 && domain.name.match(/\.test$/) ? (
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
                    <div>world</div>
                  </Button>
                )}
                </Mutation>
              ) : null }
            </Details>
          )}
        />

        <Route
          exact
          path="/name/:name/subdomains"
          render={() => (
            <SubDomains
              domain={domain}
              isOwner={isOwner}
              data-testid="subdomains"
            />
          )}
        />
      </Fragment>
    )
  }
}
export default NameDetails

import React, { Fragment, Component } from 'react'
import styled from 'react-emotion'
import { Link, Route } from 'react-router-dom'
import { Mutation } from 'react-apollo'

import { HR } from '../Typography/Basic'
import SubDomains from './SubDomains'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import RecordsItem from './RecordsItem'
import DetailsItemEditable from './DetailsItemEditable'
import AddRecord from './AddRecord'

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
`

class NameDetails extends Component {
  hasAnyRecord(domain) {
    if (parseInt(domain.resolver, 16) === 0) {
      return false
    }
    return parseInt(domain.addr, 16) !== 0 || parseInt(domain.content, 16) !== 0
  }
  render() {
    const { domain, isOwner } = this.props
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
              <Mutation mutation={SET_OWNER}>
                {mutation => (
                  <DetailsItemEditable
                    domain={domain}
                    keyName="Owner"
                    value={domain.owner}
                    isOwner={isOwner}
                    editButton="Transfer"
                    mutationButton="Transfer"
                    mutation={mutation}
                  />
                )}
              </Mutation>
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
              {parseInt(domain.resolver, 16) !== 0 ? (
                <Mutation mutation={SET_RESOLVER}>
                  {mutation => (
                    <>
                      <HR />
                      <DetailsItemEditable
                        keyName="Resolver"
                        value={domain.resolver}
                        isOwner={isOwner}
                        domain={domain}
                        mutationButton="Save"
                        mutation={mutation}
                      />
                    </>
                  )}
                </Mutation>
              ) : (
                <Fragment>
                  <HR />
                  <DetailsItem>
                    <DetailsKey greyed>Resolver</DetailsKey>
                    <DetailsValue greyed>No resolver set</DetailsValue>
                  </DetailsItem>
                </Fragment>
              )}
              {this.hasAnyRecord(domain) && (
                <Records>
                  <AddRecord title="Records" isOwner={isOwner} />
                  {parseInt(domain.resolver, 16) !== 0 ||
                    (domain.addr !== '0x' &&
                      domain.addr && (
                        <RecordsItem
                          isOwner={isOwner}
                          keyName="Address"
                          value={domain.addr}
                          type="address"
                        />
                      ))}
                  {parseInt(domain.resolver, 16) !== 0 ||
                    (domain.content !== '0x' &&
                      parseInt(domain.content, 16) !== 0 && (
                        <RecordsItem
                          isOwner={isOwner}
                          keyName="Content"
                          value={domain.content}
                        />
                      ))}
                </Records>
              )}
            </Details>
          )}
        />

        <Route
          exact
          path="/name/:name/subdomains"
          render={() => <SubDomains domain={domain} />}
        />
      </Fragment>
    )
  }
}
export default NameDetails

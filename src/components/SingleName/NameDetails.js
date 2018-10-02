import React, { Fragment, Component } from 'react'
import styled from 'react-emotion'
import { Link, Route } from 'react-router-dom'

import { HR } from '../Typography/Basic'
import SubDomains from './SubDomains'
import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { formatDate } from './utils'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
`

const Details = styled('section')`
  padding: 40px;
  transition: 0.4s;
`

const DetailsItem = styled('div')`
  display: flex;
  justify-content: flex-start;
`

const DetailsKey = styled('div')`
  color: ${({ greyed }) => (greyed ? '#CCD4DA' : '2b2b2b')};
  font-size: 16px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
  width: 220px;
  margin-bottom: 20px;
`

const DetailsValue = styled('div')`
  font-size: 18px;
  font-weight: 100;
  font-family: Overpass Mono;
`

const Records = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
`

const RecordsTitle = styled('h3')`
  /* Pointers: */
  font-family: Overpass-Bold;
  font-size: 12px;
  color: #adbbcd;
  letter-spacing: 0.5px;
  background: #f0f6fa;
  text-transform: uppercase;
  margin: 0;
  padding: 10px 20px;
`

const RecordsItem = styled(DetailsItem)`
  border-top: 1px dashed #d3d3d3;
  padding: 20px;
`

const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  width: 200px;
`

const RecordsValue = styled(DetailsValue)`
  font-size: 14px;
`

class NameDetails extends Component {
  hasAnyRecord(domain) {
    if (parseInt(domain.resolver, 16) === 0) {
      return false
    }
    return parseInt(domain.addr, 16) !== 0 || parseInt(domain.content, 16) !== 0
  }
  render() {
    const { domain } = this.props
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
              <DetailsItem>
                <DetailsKey>Owner</DetailsKey>
                <DetailsValue>
                  <EtherScanLink address={domain.owner}>
                    <SingleNameBlockies address={domain.owner} imageSize={24} />
                    {domain.owner}
                  </EtherScanLink>
                </DetailsValue>
              </DetailsItem>
              {domain.registrationDate && (
                <DetailsItem>
                  <DetailsKey>Registration Date</DetailsKey>
                  <DetailsValue>
                    {formatDate(domain.registrationDate)}
                  </DetailsValue>
                </DetailsItem>
              )}
              {parseInt(domain.resolver, 16) !== 0 ? (
                <Fragment>
                  <HR />
                  <DetailsItem>
                    <DetailsKey>Resolver</DetailsKey>
                    <DetailsValue>
                      <EtherScanLink address={domain.resolver}>
                        <SingleNameBlockies
                          address={domain.resolver}
                          imageSize={24}
                        />
                        {domain.resolver}
                      </EtherScanLink>
                    </DetailsValue>
                  </DetailsItem>
                </Fragment>
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
                  <RecordsTitle>Pointers</RecordsTitle>
                  {parseInt(domain.resolver, 16) !== 0 &&
                    domain.addr && (
                      <RecordsItem>
                        <RecordsKey>Address</RecordsKey>
                        <RecordsValue>
                          <EtherScanLink address={domain.addr}>
                            {domain.addr}
                          </EtherScanLink>
                        </RecordsValue>
                      </RecordsItem>
                    )}
                  {parseInt(domain.resolver, 16) !== 0 &&
                    parseInt(domain.content, 16) !== 0 && (
                      <RecordsItem>
                        <RecordsKey>Content</RecordsKey>
                        <RecordsValue>
                          <EtherScanLink address={domain.content}>
                            {domain.content}
                          </EtherScanLink>
                        </RecordsValue>
                      </RecordsItem>
                    )}
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

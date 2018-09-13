import React, { Component, Fragment } from 'react'
import { Link, Route } from 'react-router-dom'
import styled from 'react-emotion'
import { Title, HR } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import SubDomains from './SubDomains'

const NameContainer = styled('div')`
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
`

const TopBar = styled('div')`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ededed;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.2);
`

const RightBar = styled('div')``

const Favourite = styled(DefaultFavourite)``

const ToggleLink = styled(Link)`
  font-size: 14px;
  background: ${({ active }) => (active ? '#5384FE' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  transform: scale(${({ active }) => (active ? '1.08' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  border-radius: 90px;
`

const Toggle = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 240px;
  margin: 30px 0 30px 40px;
  border: 1px solid #dfdfdf;
  border-radius: 90px;
`

const Details = styled('section')`
  padding: 0 40px 40px 40px;
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

const EtherScanLink = ({ address, children }) => (
  <a target="_blank" href={`http://etherscan.io/address/${address}`}>
    {children}
  </a>
)

class Name extends Component {
  hasAnyRecord(details) {
    if (parseInt(details.resolver, 16) === 0) {
      return false
    }
    return parseInt(details.addr, 16) !== 0 || parseInt(details.content) !== 0
  }
  render() {
    const { details, name, pathname } = this.props
    return (
      <NameContainer>
        <TopBar>
          <Title>{name}</Title>
          <RightBar>
            <Favourite domain={details} />
          </RightBar>
        </TopBar>
        <Toggle>
          <ToggleLink
            active={pathname === `/name/${name}`}
            to={`/name/${name}`}
          >
            Details
          </ToggleLink>
          <ToggleLink
            active={pathname === `/name/${name}/subdomains`}
            to={`/name/${name}/subdomains`}
          >
            Subdomains
          </ToggleLink>
        </Toggle>
        <Route
          exact
          path="/name/:name"
          render={() => (
            <Details>
              {details.parent && (
                <DetailsItem>
                  <DetailsKey>Parent</DetailsKey>
                  <DetailsValue>
                    <Link to={`/name/${details.parent}`}>{details.parent}</Link>
                  </DetailsValue>
                </DetailsItem>
              )}
              <DetailsItem>
                <DetailsKey>Owner</DetailsKey>
                <DetailsValue>
                  <EtherScanLink address={details.owner}>
                    {details.owner}
                  </EtherScanLink>
                </DetailsValue>
              </DetailsItem>
              {details.registrationDate && (
                <DetailsItem>
                  <DetailsKey>Registration Date</DetailsKey>
                  <DetailsValue>{details.registrationDate}</DetailsValue>
                </DetailsItem>
              )}
              {parseInt(details.resolver, 16) !== 0 ? (
                <Fragment>
                  <HR />
                  <DetailsItem>
                    <DetailsKey>Resolver</DetailsKey>
                    <DetailsValue>
                      <EtherScanLink address={details.resolver}>
                        {details.resolver}
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
              {this.hasAnyRecord(details) && (
                <Records>
                  <RecordsTitle>Pointers</RecordsTitle>
                  {parseInt(details.resolver, 16) !== 0 &&
                    details.addr && (
                      <RecordsItem>
                        <RecordsKey>Address</RecordsKey>
                        <RecordsValue>
                          <EtherScanLink address={details.addr}>
                            {details.addr}
                          </EtherScanLink>
                        </RecordsValue>
                      </RecordsItem>
                    )}
                  {parseInt(details.resolver, 16) !== 0 &&
                    parseInt(details.content, 16) !== 0 && (
                      <RecordsItem>
                        <RecordsKey>Content</RecordsKey>
                        <RecordsValue>
                          <EtherScanLink address={details.content}>
                            {details.content}
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
          render={() => <SubDomains domain={details} />}
        />
      </NameContainer>
    )
  }
}

export default Name

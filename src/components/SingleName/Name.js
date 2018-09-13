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

const EtherScanLink = ({ address, children }) => (
  <a target="_blank" href={`http://etherscan.io/address/${address}`}>
    {children}
  </a>
)

class Name extends Component {
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

              {parseInt(details.content, 16) !== 0 &&
                details.addr && (
                  <DetailsItem>
                    <DetailsKey>Address</DetailsKey>
                    <DetailsValue>
                      <EtherScanLink address={details.addr}>
                        {details.addr}
                      </EtherScanLink>
                    </DetailsValue>
                  </DetailsItem>
                )}

              {parseInt(details.resolver, 16) !== 0 &&
                parseInt(details.content, 16) !== 0 && (
                  <DetailsItem>
                    <DetailsKey>Content</DetailsKey>
                    <DetailsValue>
                      <EtherScanLink address={details.content}>
                        {details.content}
                      </EtherScanLink>
                    </DetailsValue>
                  </DetailsItem>
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

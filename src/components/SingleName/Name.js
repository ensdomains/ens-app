import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { Title, H2 } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'

const NameContainer = styled('div')`
  background: white;

  box-shadow: 3px 4px 20px 0 rgba(144, 171, 191, 0.42);
  border-radius: 6px;
  .sub-domains {
    a {
      display: block;
    }
  }
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
  transition: 0.2s ease-out;
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

const SubDomainH2 = styled(H2)`
  padding: 20px 0 50px;
  text-align: center;
  color: #ccd4da;
`

const SubDomains = styled('section')``

const DetailsItem = styled('div')``

const DetailsKey = styled('div')`
  color: ${({ greyed }) => (greyed ? '#CCD4DA' : '2b2b2b')};
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
`

const DetailsValue = styled('div')``

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

              {details.resolver ? (
                <DetailsItem>
                  <DetailsKey>Resolver</DetailsKey>
                  <DetailsValue>
                    <EtherScanLink address={details.resolver}>
                      {details.resolver}
                    </EtherScanLink>
                  </DetailsValue>
                </DetailsItem>
              ) : (
                <DetailsItem>
                  <DetailsKey greyed>Resolver</DetailsKey>
                  <DetailsValue greyed>No resolver set</DetailsValue>
                </DetailsItem>
              )}
            </Details>
          )}
        />

        <Route
          exact
          path="/name/:name/subdomains"
          render={() => (
            <SubDomains>
              {parseInt(details.owner, 16) !== 0 ? (
                <Query
                  query={GET_SUBDOMAINS}
                  variables={{ name: details.name }}
                >
                  {({ loading, error, data }) => {
                    if (loading) return <Loader />
                    if (data.getSubDomains.subDomains.length === 0) {
                      return (
                        <SubDomainH2>
                          No subdomains have been added.
                        </SubDomainH2>
                      )
                    }
                    return data.getSubDomains.subDomains.map(d => (
                      <Link to={`/name/${d}`}>{d}</Link>
                    ))
                  }}
                </Query>
              ) : (
                ''
              )}
            </SubDomains>
          )}
        />
      </NameContainer>
    )
  }
}

export default Name

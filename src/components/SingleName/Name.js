import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { Title } from '../Typography/Basic'
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
  background: ${({ active }) => (active ? '#5384FE' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  padding: 10px 20px;
  border-radius: 90px;
`

const Toggle = styled('div')`
  display: inline-block;
  border: 1px solid #d2d2d2;
  border-radius: 90px;
`

const Details = styled('section')`
  padding: 40px;
`

const SubDomains = styled('section')``

const DetailsItem = styled('div')``

const DetailsKey = styled('div')``

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

              {details.resolver && (
                <DetailsItem>
                  <DetailsKey>Resolver</DetailsKey>
                  <DetailsValue>{details.resolver}</DetailsValue>
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

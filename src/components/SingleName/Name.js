import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { Title } from '../Typography/Basic'
import Favourite from '../AddFavourite/Favourite'

const NameContainer = styled('div')`
  background: white;
  border-radius: 6px;
  .sub-domains {
    a {
      display: block;
    }
  }
`

const TopBar = styled('div')`
  padding: 20px;
`

const ToggleLink = styled(Link)``

const Toggle = styled('div')``

const Details = styled('section')``

const SubDomains = styled('section')``

class Name extends Component {
  render() {
    const { details, name } = this.props
    const nameArray = name.split('.')
    const keys = Object.keys(details)
    return (
      <NameContainer>
        <TopBar>
          <Title>{details.name}</Title>
          <Favourite domain={details} />

          {name}
        </TopBar>
        <Toggle>
          <ToggleLink to={`/name/${name}`}>Details</ToggleLink>
          <ToggleLink to={`/name/${name}/subdomains`}>Subdomains</ToggleLink>
        </Toggle>
        <Route
          exact
          path="/name/:name"
          render={() => (
            <Details>
              {keys.map((key, i) => {
                return (
                  <div key={i}>
                    {key} - {String(details[key])}
                  </div>
                )
              })}
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

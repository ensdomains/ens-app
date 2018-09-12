import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import {
  GET_SUBDOMAINS,
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES
} from '../../graphql/queries'
import Loader from '../Loader'
import { Title } from '../Typography/Basic'
import { getFavourites } from '../../graphql/queries'
import AddFavourite from '../AddFavourite/AddFavourite'

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

const getFavouritesQuery = nameArray =>
  nameArray.length < 3 ? GET_FAVOURITES : GET_SUBDOMAIN_FAVOURITES

class Name extends Component {
  isFavourite(favourites, name) {
    console.log(favourites)
    console.log(name)
    return favourites.filter(domain => name === domain.name).length > 0
  }
  render() {
    const { details, name } = this.props
    const nameArray = name.split('.')
    const keys = Object.keys(details)
    return (
      <NameContainer>
        <TopBar>
          <Title>{details.name}</Title>
          <Query query={getFavouritesQuery(nameArray)}>
            {({ data, loading }) => {
              const favourites =
                nameArray.length < 3
                  ? data.favourites
                  : data.subDomainFavourites

              console.log(name)
              return (
                <AddFavourite
                  domain={details}
                  isSubDomain={nameArray.length > 2}
                  isFavourite={this.isFavourite(favourites, name)}
                />
              )
            }}
          </Query>

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

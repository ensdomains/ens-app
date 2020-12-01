import React from 'react'
import { Query } from 'react-apollo'
import DomainItem from '../DomainItem/DomainItem'
import { GET_FAVOURITES, GET_SINGLE_NAME } from '../../graphql/queries'

export const DomainInfo = ({ domainState, isFavourite, loading }) => {
  return (
    <DomainItem
      loading={loading}
      domain={domainState}
      isFavourite={isFavourite}
    />
  )
}

const DomainInfoContainer = ({ searchTerm }) => {
  return (
    <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
      {({ data, loading, error }) => {
        if (loading || !data) return null
        if (error) {
          console.error(error)
          return null
        }
        const { singleName } = data

        return (
          <Query query={GET_FAVOURITES}>
            {({ data: { favourites } = {} }) => (
              <DomainItem
                loading={loading}
                domain={singleName}
                isFavourite={
                  singleName &&
                  favourites &&
                  favourites.filter(domain => domain.name === singleName.name)
                    .length > 0
                }
              />
            )}
          </Query>
        )
      }}
    </Query>
  )
}

export default DomainInfoContainer

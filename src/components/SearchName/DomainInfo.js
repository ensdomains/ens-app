import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DomainItem from '../DomainItem/DomainItem'
import { H2 } from '../Typography/Basic'
import { GET_FAVOURITES, GET_SINGLE_NAME } from '../../graphql/queries'

export const DomainInfo = ({ domainState, isFavourite }) => {
  if (!domainState) return <Loader />

  return <DomainItem domain={domainState} isFavourite={isFavourite} />
}

const DomainInfoContainer = ({ searchTerm }) => {
  return (
    <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm + '.eth' }}>
      {({ data, loading, error }) => {
        const { singleName } = data
        return (
          <Query query={GET_FAVOURITES}>
            {({ data: { favourites } }) => (
              <Fragment>
                <H2>Top Level Domains</H2>
                {loading ? (
                  <Fragment>
                    <Loader />
                  </Fragment>
                ) : (
                  <DomainInfo
                    domainState={singleName}
                    isFavourite={
                      singleName &&
                      favourites.filter(
                        domain => domain.name === singleName.name
                      ).length > 0
                    }
                  />
                )}
              </Fragment>
            )}
          </Query>
        )
      }}
    </Query>
  )
}

export default DomainInfoContainer

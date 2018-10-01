import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DomainItem from '../DomainItem/DomainItem'
import { H2 } from '../Typography/Basic'
import { GET_FAVOURITES, GET_DOMAIN_STATE } from '../../graphql/queries'

export const DomainInfo = ({ domainState, isFavourite }) => {
  if (!domainState) return <Loader />

  return <DomainItem domain={domainState} isFavourite={isFavourite} />
}

const DomainInfoContainer = () => {
  return (
    <Query query={GET_DOMAIN_STATE}>
      {({ data: { domainState }, loading }) => {
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
                    domainState={domainState}
                    isFavourite={
                      domainState &&
                      favourites.filter(
                        domain => domain.name === domainState.name
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

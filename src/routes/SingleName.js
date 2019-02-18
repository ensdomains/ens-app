import React from 'react'
import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'

import Name from '../components/SingleName/Name'

function SingleName({
  match: {
    params: { name: searchTerm }
  },
  location: { pathname }
}) {
  return (
    <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader large center />
        if (error)
          return <div>{(console.log(error), JSON.stringify(error))}</div>
        return (
          <Name
            details={data.singleName}
            name={searchTerm}
            pathname={pathname}
            refetch={refetch}
          />
        )
      }}
    </Query>
  )
}

export default SingleName

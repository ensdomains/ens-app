import React, { useState, useEffect } from 'react'
import { validateName } from '../utils/utils'
import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'

import Name from '../components/SingleName/Name'
import { normalize } from 'api/ens'

function SingleName({
  match: {
    params: { name: searchTerm }
  },
  location: { pathname }
}) {
  const [valid, setValid] = useState(false)
  useEffect(() => {
    try {
      // This is under the assumption that validateName never returns false
      validateName(searchTerm)
      if (!valid) setValid(true)
    } catch {
      if (valid) setValid(false)
    }

    document.title = valid ? searchTerm : 'Error finding name'
  })

  const name = normalize(searchTerm)

  if (valid) {
    return (
      <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <Loader large center />
          if (error)
            return <div>{(console.log(error), JSON.stringify(error))}</div>
          return (
            <Name
              details={data.singleName}
              name={name}
              pathname={pathname}
              refetch={refetch}
            />
          )
        }}
      </Query>
    )
  }

  return <SearchErrors errors={['domainMalformed']} searchTerm={searchTerm} />
}

export default SingleName

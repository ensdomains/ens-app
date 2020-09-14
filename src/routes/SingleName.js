import React, { useState, useEffect } from 'react'
import { validateName, parseSearchTerm } from '../utils/utils'
import { useScrollTo } from '../components/hooks'

import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'

import Name from '../components/SingleName/Name'

function SingleName({
  match: {
    params: { name: searchTerm }
  },
  location: { pathname }
}) {
  useScrollTo(0)
  document.body.style.zoom = window.innerWidth / window.outerWidth
  const [valid, setValid] = useState(undefined)
  const [type, setType] = useState(undefined)
  const [name, setNormalisedName] = useState('')
  let errorMessage

  useEffect(() => {
    let normalisedName
    try {
      // This is under the assumption that validateName never returns false
      normalisedName = validateName(searchTerm)
      setNormalisedName(normalisedName)
      document.title = searchTerm
    } catch {
      document.title = 'Error finding name'
    } finally {
      parseSearchTerm(normalisedName || searchTerm).then(_type => {
        if (_type === 'supported' || _type === 'tld' || _type === 'search') {
          setValid(true)
          setType(_type)
        } else {
          if (_type === 'invalid') {
            setType('domainMalformed')
          } else {
            setType(_type)
          }
          setValid(false)
        }
      })
    }
  }, [searchTerm])
  if (valid) {
    return (
      <Query query={GET_SINGLE_NAME} variables={{ name }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <Loader large center />
          if (error)
            return <div>{(console.log(error), JSON.stringify(error))}</div>

          return (
            <Name
              details={data.singleName}
              name={name}
              pathname={pathname}
              type={type}
              refetch={refetch}
            />
          )
        }}
      </Query>
    )
  } else if (valid === false) {
    if (type === 'invalid') {
      errorMessage = 'domainMalformed'
    } else if (type === 'short') {
      errorMessage = 'tooShort'
    } else {
      errorMessage = type
    }
    return (
      <SearchErrors errors={[errorMessage]} searchTerm={name || searchTerm} />
    )
  } else {
    return <Loader large center />
  }
}

export default SingleName

import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { validateName, parseSearchTerm } from '../utils/utils'
import { useScrollTo } from '../components/hooks'
import { GET_SINGLE_NAME } from '../graphql/queries'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'
import Name from '../components/SingleName/Name'
import { singleNameMutation } from '../apollo/mutations/mutations'

const SINGLE_NAME = gql`
  query singleName {
    isENSReady
  }
`

function SingleName({
  match: {
    params: { name: searchTerm }
  },
  location: { pathname }
}) {
  useScrollTo(0)

  //document.body.style.zoom = window.innerWidth / window.outerWidth
  const [valid, setValid] = useState(undefined)
  const [type, setType] = useState(undefined)
  let errorMessage

  const {
    data: { isENSReady }
  } = useQuery(SINGLE_NAME)
  const { data } = useQuery(GET_SINGLE_NAME, { variables: { name } })
  console.log('data!!!!: ', data)

  useEffect(() => {
    let normalisedName
    if (isENSReady) {
      try {
        // This is under the assumption that validateName never returns false
        normalisedName = validateName(searchTerm)
        document.title = searchTerm
        singleNameMutation(normalisedName)
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
    }
  }, [searchTerm, isENSReady])

  if (valid) {
    return (
      <Name
        details={data.singleName}
        name={name}
        pathname={pathname}
        type={type}
      />
    )
  }

  return <div>hi there</div>

  // } else if (valid === false) {
  //   if (type === 'invalid') {
  //     errorMessage = 'domainMalformed'
  //   } else if (type === 'short') {
  //     errorMessage = 'tooShort'
  //   } else {
  //     errorMessage = type
  //   }
  //   return (
  //     <SearchErrors errors={[errorMessage]} searchTerm={name || searchTerm} />
  //   )
  // } else {
  //   return <Loader large center />
  // }
}

export default SingleName

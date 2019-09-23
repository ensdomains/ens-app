import React from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { SET_TEXT } from 'graphql/mutations'
import { GET_TEXT } from 'graphql/queries'
import Loader from 'components/Loader'

function Record({ textKey, name }) {
  const { data, loading, error } = useQuery(GET_TEXT, {
    variables: {
      name,
      key: textKey
    }
  })

  if (loading) {
    return <Loader />
  }
  console.log(data)
  return (
    <div>
      {textKey} - {data.getText}
    </div>
  )
}

function Records({ name }) {
  const keys = ['url']

  return keys.map(key => <Record textKey={key} name={name} />)
}

export default function TextRecord({ domain }) {
  let inputKey
  let inputValue
  const [setText, { data }] = useMutation(SET_TEXT)
  return (
    <div>
      <Records name={domain.name} />
      <form
        onSubmit={e => {
          e.preventDefault()
          setText({
            variables: {
              name: domain.name,
              key: inputKey.value,
              recordValue: inputValue.value
            }
          })
          inputKey.value = ''
          inputValue.value = ''
        }}
      >
        <input
          ref={node => {
            inputKey = node
          }}
        />
        <input
          ref={node => {
            inputValue = node
          }}
        />
        <button type="submit">Add Text Record</button>
      </form>
    </div>
  )
}

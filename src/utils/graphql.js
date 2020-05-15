import get from 'lodash/get'
import { decryptName } from '../api/labels'

export function refetchTilUpdated(
  refetch,
  interval,
  keyToCompare,
  name,
  prevData,
  getterString
) {
  let maxTries = 10
  let tries = maxTries
  let incrementedInterval = interval

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries--
        incrementedInterval = interval * (maxTries - tries + 1)
        refetch().then(({ data }) => {
          const updated =
            get(data, getterString).find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare] !==
            get(prevData, getterString).find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare]

          if (updated) return
          return recurseRefetch()
        })
      }, incrementedInterval)
    }
    return
  }

  recurseRefetch()
}

export function refetchTilUpdatedSingle({
  refetch,
  interval,
  keyToCompare,
  prevData,
  getterString
}) {
  let maxTries = 10
  let tries = maxTries
  let incrementedInterval = interval

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries--
        incrementedInterval = interval * (maxTries - tries + 1)
        refetch().then(({ data }) => {
          console.log(
            'get(data, getterString)[keyToCompare]',
            get(data, getterString)[keyToCompare],
            data
          )
          console.log(
            'get(prevData, getterString)[keyToCompare]',
            get(prevData, getterString)[keyToCompare],
            prevData
          )
          const updated =
            get(data, getterString)[keyToCompare] !==
            get(prevData, getterString)[keyToCompare]

          console.log('updated', updated)
          if (updated) return
          return recurseRefetch()
        })
      }, incrementedInterval)
    }
    return
  }

  recurseRefetch()
}

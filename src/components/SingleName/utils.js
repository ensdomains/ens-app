import moment from 'moment'

export function formatDate(unixTimeStamp) {
  return (
    moment(unixTimeStamp).format('YYYY.MM.DD') +
    ' at ' +
    moment(unixTimeStamp).format('hh:mm:ss')
  )
}

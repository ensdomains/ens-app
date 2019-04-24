import moment from 'moment'

export function formatDate(unixTimeStamp, noTime) {
  let date = moment(unixTimeStamp).format('YYYY.MM.DD')
  if (!noTime) {
    date = date + ' at ' + moment(unixTimeStamp).format('hh:mm:ss')
  }
  return date
}

export function humanizeDate(timeLeft) {
  if (timeLeft < 3600000) {
    const minutes = Math.floor(moment.duration(timeLeft).asMinutes())
    const seconds = Math.floor(moment.duration(timeLeft).seconds())
    return `${minutes} m ${seconds}s`
  } else {
    return `${Math.floor(
      moment
        .duration(timeLeft)
        .asHours()
        .toFixed(0)
    )}h ${moment
      .duration(timeLeft)
      .minutes()
      .toFixed(0)}m`
  }
}

export const yearInSeconds = 31556952

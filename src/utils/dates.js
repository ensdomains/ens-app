import moment from 'moment'

export const GRACE_PERIOD = 86400 * 90
export const PREMIUM_PERIOD = 86400 * 28

export function formatDate(unixTimeStamp, noTime) {
  let date = moment(unixTimeStamp).format('YYYY.MM.DD')
  if (!noTime) {
    date = date + ' at ' + moment(unixTimeStamp).format('HH:mm (UTCZ)')
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

export function calculateIsExpiredSoon(expiryDate) {
  if (!expiryDate) return expiryDate

  const ADVANCE_WARNING_DAYS = 30

  const currentTime = new Date().getTime()
  const expiryTime = new Date(expiryDate * 1000).getTime()
  const differenceInTime = expiryTime - currentTime
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)

  return differenceInDays < ADVANCE_WARNING_DAYS
}

export const yearInSeconds = 31556952

export function calculateDuration(years) {
  return parseInt(parseFloat(years) * yearInSeconds)
}

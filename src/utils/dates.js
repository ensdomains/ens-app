import moment from 'moment'

export function formatDate(unixTimeStamp) {
  return (
    moment(unixTimeStamp).format('YYYY.MM.DD') +
    ' at ' +
    moment(unixTimeStamp).format('hh:mm:ss')
  )
}

export function humanizeDate(timeLeft) {
  if (timeLeft < 3600000) {
    return moment.duration(timeLeft).humanize()
  } else {
    return `${moment.duration(timeLeft).hours()} hours`
  }
}

export function getTimeLeft(domain) {
  if (domain.state === 'Auction') {
    return new Date(domain.revealDate).getTime() - new Date().getTime()
  } else if (domain.state === 'Reveal') {
    return new Date(domain.registrationDate).getTime() - new Date().getTime()
  } else {
    return false
  }
}

export function getPercentTimeLeft(timeLeft, domain) {
  if (timeLeft === false) {
    return 0
  }

  if (domain.state === 'Auction') {
    let totalTime = 259200000
    return ((totalTime - timeLeft) / totalTime) * 100
  } else if (domain.state === 'Reveal') {
    let totalTime = 172800000
    return ((totalTime - timeLeft) / totalTime) * 100
  }
}

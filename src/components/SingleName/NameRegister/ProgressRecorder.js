import crypto from 'crypto'
import moment from 'moment'

function randomSecret() {
  return '0x' + crypto.randomBytes(32).toString('hex')
}

const Store = {
  get: label => {
    return window.localStorage.getItem('progress')
      ? JSON.parse(window.localStorage.getItem('progress'))[label]
      : null
  },
  set: (label, obj) => {
    let data = {}
    let progress
    if ((progress = window.localStorage.getItem('progress'))) {
      data = JSON.parse(progress)
    }
    data[label] = {
      ...data[label],
      ...obj
    }
    window.localStorage.setItem('progress', JSON.stringify(data))
  },
  remove: label => {
    let data = {}
    let progress
    if ((progress = window.localStorage.getItem('progress'))) {
      data = JSON.parse(progress)
    }
    delete data[label]
    window.localStorage.setItem('progress', JSON.stringify(data))
  }
}

const ProgressRecorder = ({
  checkCommitment,
  domain,
  networkId,
  states,
  step,
  dispatch,
  secret,
  setSecret,
  years,
  setYears,
  timerRunning,
  setTimerRunning,
  waitUntil,
  setWaitUntil,
  secondsPassed,
  setSecondsPassed,
  commitmentExpirationDate,
  setCommitmentExpirationDate,
  now
}) => {
  const stepIndex = Object.keys(states).indexOf(step)

  const label = `${networkId}-${domain.label}`
  let savedStepIndex = 0
  let savedStep, isBehind
  savedStep = Store.get(label)
  if (!secret) {
    if (savedStep && savedStep.secret) {
      setSecret(savedStep.secret)
    } else {
      setSecret(randomSecret())
    }
  }
  if (!years) {
    if (savedStep && savedStep.years) {
      setYears(savedStep.years)
    } else {
      setYears(1)
    }
  }
  if (!waitUntil) {
    if (savedStep && savedStep.waitUntil) {
      setWaitUntil(savedStep.waitUntil)
    }
  }
  if (!secondsPassed) {
    if (savedStep && savedStep.secondsPassed) {
      setSecondsPassed(savedStep.secondsPassed)
    }
  }
  if (!commitmentExpirationDate) {
    if (savedStep && savedStep.commitmentExpirationDate) {
      setCommitmentExpirationDate(savedStep.commitmentExpirationDate)
    }
  }

  savedStepIndex = Object.keys(states).indexOf(savedStep && savedStep.step)
  isBehind = savedStepIndex - stepIndex > 0

  if (savedStep && now) {
    if (
      savedStep.commitmentExpirationDate &&
      moment(savedStep.commitmentExpirationDate).isSameOrBefore(now)
    ) {
      Store.remove(label)
    } else if (isBehind) {
      dispatch('NEXT')
    }
  }

  switch (step) {
    case 'PRICE_DECISION':
      if (!savedStep) {
        Store.set(label, { step, secret })
      } else {
        if (!savedStep.secret || !savedStep.years) {
          Store.set(label, { step, secret, years })
        } else {
          let commitmentDate = new Date(checkCommitment * 1000)
          if (commitmentDate > 0) {
            dispatch('NEXT') // Go to pending
            dispatch('NEXT') // Go to confirmed
          } else {
            // This should be called only when user increament/decrement years
            Store.set(label, { step, secret, years })
          }
        }
      }
      break
    case 'COMMIT_CONFIRMED':
      Store.set(label, {
        step,
        secret,
        waitUntil,
        secondsPassed,
        commitmentExpirationDate
      })
      if (!timerRunning) {
        setTimerRunning(true)
      }
      break
    case 'AWAITING_REGISTER':
      if (timerRunning) {
        setTimerRunning(false)
      }
      break
  }
  return secret
}

export default ProgressRecorder

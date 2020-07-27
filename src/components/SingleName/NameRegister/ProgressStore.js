import crypto from 'crypto'

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
    data[label] = obj
    window.localStorage.setItem('progress', JSON.stringify(data))
  },
  // Get rid of all names in progress
  remove: () => {
    window.localStorage.removeItem('progress')
  }
}

const ProgressStore = ({
  domain,
  networkId,
  states,
  step,
  dispatch,
  secret,
  setSecret,
  timerRunning,
  setTimerRunning,
  waitUntil,
  setWaitUntil,
  secondsPassed,
  setSecondsPassed
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
  if (!waitUntil) {
    if (savedStep && savedStep.waitUntil) {
      setWaitUntil(savedStep.waitUntil)
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

  savedStepIndex = Object.keys(states).indexOf(savedStep && savedStep.step)
  isBehind = savedStepIndex - stepIndex > 0
  if (isBehind) {
    dispatch('NEXT')
  }

  // TODO: Expire keys if older than maxCommitmentAge
  // https://github.com/ensdomains/ethregistrar/blob/master/contracts/ETHRegistrarController.sol#L35
  switch (step) {
    case 'PRICE_DECISION':
      if (!savedStep) {
        Store.set(label, { step })
      }
      break
    case 'COMMIT_CONFIRMED':
      Store.set(label, {
        step,
        secret,
        waitUntil,
        secondsPassed
      })
      if (!timerRunning) {
        setTimerRunning(true)
      }
      break
    case 'AWAITING_REGISTER':
      Store.set(label, { step, secret })
      if (timerRunning) {
        setTimerRunning(false)
      }
      break
  }
  return secret
}

export default ProgressStore

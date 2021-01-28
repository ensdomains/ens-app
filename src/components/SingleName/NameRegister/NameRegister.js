import React, { useState, useReducer } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { Query, useQuery } from 'react-apollo'
import moment from 'moment'
import {
  CHECK_COMMITMENT,
  GET_MINIMUM_COMMITMENT_AGE,
  GET_MAXIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  WAIT_BLOCK_TIMESTAMP,
  GET_BALANCE
} from 'graphql/queries'
import {
  useInterval,
  useEthPrice,
  useGasPrice,
  useBlock
} from 'components/hooks'
import { useAccount } from '../../QueryAccount'
import { registerMachine, registerReducer } from './registerReducer'
import { sendNotification } from './notification'
import { calculateDuration, yearInSeconds } from 'utils/dates'

import Loader from 'components/Loader'
import Explainer from './Explainer'
import CTA from './CTA'
import Progress from './Progress'
import NotAvailable from './NotAvailable'
import Pricer from '../Pricer'
import LineGraph from './LineGraph'
import Premium from './Premium'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'

const NameRegisterContainer = styled('div')`
  padding: 20px 40px;
`

const PremiumWarning = styled('div')`
  background-color: #fef6e9;
  color: black;
  padding: 1em;
  margin-bottom: 1em;
`

const NameRegister = ({
  domain,
  waitTime,
  refetch,
  refetchIsMigrated,
  readOnly,
  registrationOpen
}) => {
  const { t } = useTranslation()
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  let now, showPremiumWarning, currentPremium, currentPremiumInEth, underPremium
  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')
  const [years, setYears] = useState(1)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [commitmentTimerRunning, setCommitmentTimerRunning] = useState(false)
  const [blockCreatedAt, setBlockCreatedAt] = useState(null)
  const [waitUntil, setWaitUntil] = useState(null)
  const [targetDate, setTargetDate] = useState(false)
  const [targetPremium, setTargetPremium] = useState(false)
  const [commitmentExpirationDate, setCommitmentExpirationDate] = useState(
    false
  )
  const { loading: ethUsdPriceLoading, price: ethUsdPrice } = useEthPrice()
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  const { block } = useBlock()
  const [invalid, setInvalid] = useState(false)
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil
    }
  })
  const account = useAccount()
  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account }
  })

  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE
  )
  if (block) {
    now = moment(block.timestamp * 1000)
  }
  if (!commitmentExpirationDate && getMaximumCommitmentAge && blockCreatedAt) {
    setCommitmentExpirationDate(
      moment(blockCreatedAt).add(getMaximumCommitmentAge, 'second')
    )
  }
  const { data: { checkCommitment = false } = {} } = useQuery(
    CHECK_COMMITMENT,
    {
      variables: {
        label: domain.label,
        secret,
        // Add this varialbe so that it keeps polling only during the timer is on
        commitmentTimerRunning
      }
    }
  )

  ProgressRecorder({
    checkCommitment,
    domain,
    networkId,
    states: registerMachine.states,
    dispatch,
    step,
    secret,
    setSecret,
    timerRunning,
    setTimerRunning,
    waitUntil,
    setWaitUntil,
    secondsPassed,
    setSecondsPassed,
    commitmentExpirationDate,
    setCommitmentExpirationDate,
    now
  })
  useInterval(
    () => {
      if (blockCreatedAt && !waitUntil) {
        setWaitUntil(blockCreatedAt + waitTime * 1000)
      }
      if (secondsPassed < waitTime) {
        setSecondsPassed(s => s + 1)
      } else {
        if (waitBlockTimestamp && timerRunning) {
          incrementStep()
          sendNotification(
            `${domain.name} ${t('register.notifications.ready')}`
          )
        }
        setTimerRunning(false)
      }
    },
    timerRunning ? 1000 : null
  )
  useInterval(
    () => {
      if (checkCommitment > 0) {
        incrementStep()
        setTimerRunning(true)
        setCommitmentTimerRunning(false)
      } else {
        setCommitmentTimerRunning(new Date())
      }
    },
    commitmentTimerRunning ? 1000 : null
  )
  const parsedYears = parseFloat(years)
  const duration = calculateDuration(years)
  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label,
        commitmentTimerRunning
      }
    }
  )
  let hasSufficientBalance
  if (!blockCreatedAt && checkCommitment > 0) {
    setBlockCreatedAt(checkCommitment * 1000)
  }
  if (getBalance && getRentPrice) {
    hasSufficientBalance = getBalance.gt(getRentPrice)
  }
  if (blockCreatedAt && !waitUntil) {
    setWaitUntil(blockCreatedAt + waitTime * 1000)
  }

  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds
  const isAboveMinDuration = parsedYears > twentyEightDaysInYears
  const waitPercentComplete = (secondsPassed / waitTime) * 100

  const expiryDate = moment(domain.expiryTime)
  const releasedDate = expiryDate.clone().add(90, 'days')
  const zeroPremiumDate = releasedDate.clone().add(28, 'days')
  const startingPremiumInUsd = 2000
  const diff = zeroPremiumDate.diff(releasedDate)
  const rate = 2000 / diff
  if (!registrationOpen) return <NotAvailable domain={domain} />
  if (ethUsdPriceLoading || gasPriceLoading) return <></>

  const getTargetAmountByDate = date => {
    return zeroPremiumDate.diff(date) * rate
  }

  const getTargetDateByAmount = amount => {
    return zeroPremiumDate.clone().subtract(amount / rate / 1000, 'second')
  }

  if (!targetDate) {
    setTargetDate(zeroPremiumDate)
    setTargetPremium(getTargetAmountByDate(zeroPremiumDate))
  }

  if (block) {
    showPremiumWarning = now.isBetween(releasedDate, zeroPremiumDate)
    currentPremium = getTargetAmountByDate(now)
    currentPremiumInEth = currentPremium / ethUsdPrice
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }
  const handleTooltip = tooltipItem => {
    let delimitedParsedValue = tooltipItem.yLabel
    if (targetPremium !== delimitedParsedValue) {
      setTargetDate(getTargetDateByAmount(delimitedParsedValue))
      setTargetPremium(delimitedParsedValue.toFixed(2))
    }
  }

  const handlePremium = target => {
    const { value } = target
    const parsedValue = value.replace('$', '')
    if (
      !isNaN(parsedValue) &&
      parseInt(parsedValue || 0) <= startingPremiumInUsd
    ) {
      if (targetPremium !== parsedValue) {
        setTargetDate(getTargetDateByAmount(parsedValue))
        setTargetPremium(parsedValue)
      }
      setInvalid(false)
    } else {
      setInvalid(true)
    }
  }
  return (
    <NameRegisterContainer>
      {step === 'PRICE_DECISION' && (
        <Pricer
          name={domain.label}
          duration={duration}
          years={years}
          setYears={setYears}
          ethUsdPriceLoading={ethUsdPriceLoading}
          ethUsdPremiumPrice={currentPremium}
          ethUsdPrice={ethUsdPrice}
          gasPrice={gasPrice}
          loading={rentPriceLoading}
          price={getRentPrice}
          underPremium={underPremium}
          displayGas={true}
        />
      )}
      {showPremiumWarning ? (
        <PremiumWarning>
          <h2>{t('register.premiumWarning.title')}</h2>
          <p>{t('register.premiumWarning.description')} </p>
          <LineGraph
            startDate={releasedDate}
            currentDate={now}
            targetDate={targetDate}
            endDate={zeroPremiumDate}
            startPremium={startingPremiumInUsd}
            currentPremiumInEth={currentPremiumInEth}
            currentPremium={currentPremium}
            targetPremium={targetPremium}
            handleTooltip={handleTooltip}
          />
          <Premium
            handlePremium={handlePremium}
            targetPremium={targetPremium}
            name={domain.name}
            invalid={invalid}
            targetDate={targetDate}
          />
        </PremiumWarning>
      ) : (
        ''
      )}
      <Explainer
        step={step}
        waitTime={waitTime}
        waitPercentComplete={waitPercentComplete}
      />
      <Progress step={step} waitPercentComplete={waitPercentComplete} />
      <CTA
        hasSufficientBalance={hasSufficientBalance}
        waitTime={waitTime}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        secret={secret}
        step={step}
        label={domain.label}
        duration={duration}
        secondsPassed={secondsPassed}
        timerRunning={timerRunning}
        setTimerRunning={setTimerRunning}
        setCommitmentTimerRunning={setCommitmentTimerRunning}
        commitmentTimerRunning={commitmentTimerRunning}
        setBlockCreatedAt={setBlockCreatedAt}
        refetch={refetch}
        refetchIsMigrated={refetchIsMigrated}
        isAboveMinDuration={isAboveMinDuration}
        readOnly={readOnly}
        price={getRentPrice}
        ethUsdPrice={!ethUsdPriceLoading && ethUsdPrice}
      />
    </NameRegisterContainer>
  )
}

const NameRegisterDataWrapper = props => {
  return (
    <Query query={GET_MINIMUM_COMMITMENT_AGE}>
      {({ data, loading, error }) => {
        if (loading) return <Loader withWrap={true} large />
        if (error) {
          console.log(error)
        }
        const { getMinimumCommitmentAge } = data
        return <NameRegister waitTime={getMinimumCommitmentAge} {...props} />
      }}
    </Query>
  )
}

export default NameRegisterDataWrapper

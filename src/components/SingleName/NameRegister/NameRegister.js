import React, { useState, useReducer, useEffect } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import {
  CHECK_COMMITMENT,
  GET_MINIMUM_COMMITMENT_AGE,
  GET_MAXIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE_AND_PREMIUM,
  WAIT_BLOCK_TIMESTAMP,
  GET_BALANCE,
  GET_ETH_PRICE,
  GET_PRICE_CURVE
} from 'graphql/queries'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'
import { useAccount } from '../../QueryAccount'
import { registerMachine, registerReducer } from './registerReducer'
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
import { sendNotification } from './notification'
import PremiumPriceOracle from './PremiumPriceOracle'
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
  isReadOnly,
  isNameWrapped,
  registrationOpen
}) => {
  const { t } = useTranslation()
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  let now, showPremiumWarning, currentPremium, underPremium
  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')
  const [years, setYears] = useState(false)
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
  const {
    data: { getEthPrice: ethUsdPrice } = {},
    loading: ethUsdPriceLoading
  } = useQuery(GET_ETH_PRICE)
  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  const { block } = useBlock()
  const [invalid, setInvalid] = useState(false)
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil
    },
    fetchPolicy: 'no-cache'
  })
  const account = useAccount()
  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account },
    fetchPolicy: 'no-cache'
  })

  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE,
    {
      fetchPolicy: 'no-cache'
    }
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
      },
      fetchPolicy: 'no-cache'
    }
  )
  let i = 0

  ProgressRecorder({
    checkCommitment,
    domain,
    networkId,
    states: registerMachine.states,
    dispatch,
    step,
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
  const {
    data: { getRentPriceAndPremium } = {},
    loading: rentPriceLoading
  } = useQuery(GET_RENT_PRICE_AND_PREMIUM, {
    variables: {
      duration,
      label: domain.label,
      commitmentTimerRunning,
      block: block?.number
    },
    skip: !(block && block.number),
    fetchPolicy: 'no-cache'
  })
  let getRentPrice, getPremiumPrice
  if (getRentPriceAndPremium) {
    getRentPrice = getRentPriceAndPremium.price
    getPremiumPrice = getRentPriceAndPremium.premium
  }

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
  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate, startingPremiumInUsd } = oracle

  if (!registrationOpen) return <NotAvailable domain={domain} />
  if (ethUsdPriceLoading || gasPriceLoading) return <></>

  if (!targetDate) {
    setTargetDate(zeroPremiumDate)
    setTargetPremium(
      oracle.getTargetAmountByDaysPast(oracle.getDaysPast(zeroPremiumDate))
    )
  }

  if (block) {
    showPremiumWarning = now.isBetween(releasedDate, zeroPremiumDate)
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }
  const handleTooltip = tooltipItem => {
    let delimitedParsedValue = tooltipItem.yLabel
    if (targetPremium !== delimitedParsedValue) {
      setTargetDate(oracle.getTargetDateByAmount(delimitedParsedValue))
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
        setTargetDate(oracle.getTargetDateByAmount(parsedValue))
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
          premiumOnlyPrice={getPremiumPrice}
          underPremium={underPremium}
          displayGas={true}
        />
      )}
      {showPremiumWarning ? (
        <PremiumWarning>
          <h2>{t('register.premiumWarning.title')}</h2>
          <p>
            {getPriceCurve === 'exponential'
              ? t('register.premiumWarning.exponentialWarningDescripiton')
              : t('register.premiumWarning.description')}
          </p>
          <LineGraph
            startDate={releasedDate}
            currentDate={now}
            targetDate={targetDate}
            endDate={zeroPremiumDate}
            targetPremium={targetPremium}
            ethUsdPrice={ethUsdPrice}
            handleTooltip={handleTooltip}
            underPremium={underPremium}
            oracle={oracle}
            price={getRentPrice}
            now={now}
            premiumOnlyPrice={getPremiumPrice}
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
        isReadOnly={isReadOnly}
        isNameWrapped={isNameWrapped}
        price={getRentPrice}
        years={years}
        premium={currentPremium}
        ethUsdPrice={!ethUsdPriceLoading && ethUsdPrice}
      />
    </NameRegisterContainer>
  )
}

const NameRegisterDataWrapper = props => {
  const { data, loading, error } = useQuery(GET_MINIMUM_COMMITMENT_AGE)

  if (loading) return <Loader withWrap={true} large />
  if (error) {
    console.log(error)
  }
  const { getMinimumCommitmentAge } = data
  return <NameRegister waitTime={getMinimumCommitmentAge} {...props} />
}

export default NameRegisterDataWrapper

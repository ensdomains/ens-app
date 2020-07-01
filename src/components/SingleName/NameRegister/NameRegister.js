import React, { useState, useReducer } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { Query, useQuery } from 'react-apollo'
import moment from 'moment'
import {
  GET_MINIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  GET_PREMIUM,
  GET_TIME_UNTIL_PREMIUM
} from 'graphql/queries'
import { useInterval, useEthPrice, useBlock } from 'components/hooks'
import { registerMachine, registerReducer } from './registerReducer'
import { sendNotification } from './notification'
import { calculateDuration, yearInSeconds } from 'utils/dates'

import Loader from 'components/Loader'
import Explainer from './Explainer'
import CTA from './CTA'
import Progress from './Progress'
import NotAvailable from './NotAvailable'
import Pricer from '../Pricer'
import EthVal from 'ethval'
import LineGraph from './LineGraph'
import Premium from './Premium'

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
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const incrementStep = () => dispatch('NEXT')
  const decrementStep = () => dispatch('PREVIOUS')
  const [years, setYears] = useState(1)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [targetDate, setTargetDate] = useState(false)
  const [targetPremium, setTargetPremium] = useState(false)
  const { loading: ethUsdPriceLoading, price: ethUsdPrice } = useEthPrice()
  const { loading: blockLoading, block } = useBlock()
  const [premium, setPremium] = useState(0)
  const [invalid, setInvalid] = useState(false)

  useInterval(
    () => {
      if (secondsPassed < waitTime) {
        setSecondsPassed(s => s + 1)
      } else {
        setTimerRunning(false)
        incrementStep()
        sendNotification(`${domain.name} ${t('register.notifications.ready')}`)
      }
    },
    timerRunning ? 1000 : null
  )

  const parsedYears = parseFloat(years)
  const duration = calculateDuration(years)
  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label
      }
    }
  )

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

  let now, showPremiumWarning, currentPremium, currentPremiumInEth

  if (!registrationOpen) return <NotAvailable domain={domain} />
  if (ethUsdPriceLoading) return <></>

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
    now = moment(block.timestamp * 1000)
    showPremiumWarning = now.isBetween(releasedDate, zeroPremiumDate)
    currentPremium = getTargetAmountByDate(now)
    currentPremiumInEth = currentPremium / ethUsdPrice
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
          loading={rentPriceLoading}
          price={getRentPrice}
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
        waitTime={waitTime}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        step={step}
        label={domain.label}
        duration={duration}
        secondsPassed={secondsPassed}
        setTimerRunning={setTimerRunning}
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

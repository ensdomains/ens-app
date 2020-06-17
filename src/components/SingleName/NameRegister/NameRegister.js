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
const DAY = 60 * 60 * 24

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

  const expiryTime = domain.expiryTime && domain.expiryTime.getTime() / 1000
  const { data: { getPremium } = {}, loading: getPremiumLoading } = useQuery(
    GET_PREMIUM,
    {
      variables: {
        name: domain.label,
        expires: expiryTime,
        duration
      }
    }
  )
  const {
    data: { getTimeUntilPremium } = {},
    loading: getTimeUntilPremiumLoading
  } = useQuery(GET_TIME_UNTIL_PREMIUM, {
    variables: {
      expires: expiryTime,
      amount: premium
    }
  })
  const {
    data: { getTimeUntilPremium: getTimeUntilZeroPremium } = {},
    loading: getTimeUntilZeroPremiumLoading
  } = useQuery(GET_TIME_UNTIL_PREMIUM, {
    variables: {
      expires: expiryTime,
      amount: 0
    }
  })

  const releasedDate = moment(expiryTime * 1000).add(90, 'days')
  let timeUntilPremium,
    premiumInEth,
    ethUsdPremiumPrice,
    premiumInEthVal,
    daysPast,
    totalDays,
    daysRemaining,
    now,
    timeUntilZeroPremium,
    showPremiumWarning
  if (getTimeUntilPremium) {
    timeUntilPremium = moment(getTimeUntilPremium.toNumber() * 1000)
  }
  if (getPremium) {
    premiumInEth = new EthVal(getPremium.toString()).toEth()
    premiumInEthVal = new EthVal(getPremium.toString()).toEth()
    ethUsdPremiumPrice = premiumInEth * ethUsdPrice
  }
  if (getTimeUntilZeroPremium) {
    timeUntilZeroPremium = moment(getTimeUntilZeroPremium.toNumber() * 1000)
  }
  if (block && timeUntilZeroPremium) {
    now = moment(block.timestamp * 1000)
    daysPast = parseInt(now.diff(releasedDate) / DAY / 1000)
    totalDays = parseInt(timeUntilZeroPremium.diff(releasedDate) / DAY / 1000)
    daysRemaining = totalDays - daysPast
    showPremiumWarning = now.isBetween(releasedDate, timeUntilZeroPremium)
  }
  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds
  const isAboveMinDuration = parsedYears > twentyEightDaysInYears
  const waitPercentComplete = (secondsPassed / waitTime) * 100
  const startingPremiumInDai = 2000
  if (!registrationOpen) return <NotAvailable domain={domain} />
  const handlePremium = evt => {
    const { value } = evt.target
    const parsedValue = value.replace('$', '')
    const valueInEthVal = new EthVal(
      parseFloat(parsedValue) / ethUsdPrice,
      'eth'
    )

    if (
      !isNaN(parsedValue) &&
      parseInt(parsedValue || 0) <= startingPremiumInDai
    ) {
      setPremium(valueInEthVal.toWei().toString(16))
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
          ethUsdPremiumPrice={ethUsdPremiumPrice}
          ethUsdPrice={ethUsdPrice}
          loading={rentPriceLoading}
          price={getRentPrice}
        />
      )}
      {showPremiumWarning ? (
        <PremiumWarning>
          <h2>This name has a temporary premium.</h2>
          <p>
            To prevent a rush to register names with high aas prices, newly
            released names have a temporary premium that starts at $2,000 and
            reduces over 28 days until the premium is gone. Enter the amount
            you're willing to pay as a premium to learn which date to revisit
            the app to register the name. This is because this name was just
            released on{' '}
          </p>
          <LineGraph
            currentDays={10}
            premiumInEth={premiumInEth}
            ethUsdPremiumPrice={ethUsdPremiumPrice}
            startingPriceInEth={startingPremiumInDai / ethUsdPrice}
            daysPast={daysPast}
            totalDays={totalDays}
            daysRemaining={daysRemaining}
          />
          <Premium
            handlePremium={handlePremium}
            name={domain.name}
            invalid={invalid}
            timeUntilPremium={timeUntilPremium}
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

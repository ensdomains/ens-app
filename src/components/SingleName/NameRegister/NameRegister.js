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
  const [estimateValue, setEstimateValue] = useState('$0')
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

  if (getTimeUntilZeroPremiumLoading || ethUsdPriceLoading) {
    return <></>
  }

  const releasedDate = moment(expiryTime * 1000).add(90, 'days')
  let timeUntilPremium,
    premiumInEth,
    premiumInEthVal,
    ethUsdPremiumPrice,
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
  if (block && premiumInEth && timeUntilZeroPremium) {
    now = moment(block.timestamp * 1000)
    showPremiumWarning = now.isBetween(releasedDate, timeUntilZeroPremium)
  }
  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds
  const isAboveMinDuration = parsedYears > twentyEightDaysInYears
  const waitPercentComplete = (secondsPassed / waitTime) * 100
  const startingPremiumInDai = 2000
  if (!registrationOpen) return <NotAvailable domain={domain} />

  const handleTooltip = parsedValue => {
    setEstimateValue('$' + parsedValue)
    const valueInEthVal = new EthVal(parsedValue / ethUsdPrice, 'eth')
    setPremium(valueInEthVal.toWei().toString(16))
  }

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
      setEstimateValue('$' + parsedValue)
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
          <h2>{t('register.premiumWarning.title')}</h2>
          <p>{t('register.premiumWarning.description')} </p>
          <LineGraph
            now={now}
            releasedDate={releasedDate}
            timeUntilZeroPremium={timeUntilZeroPremium}
            premiumInEth={premiumInEth}
            ethUsdPremiumPrice={ethUsdPremiumPrice}
            startingPremiumInDai={startingPremiumInDai}
            ethUsdPrice={ethUsdPrice}
            handleTooltip={handleTooltip}
          />
          <Premium
            handlePremium={handlePremium}
            estimateValue={estimateValue}
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

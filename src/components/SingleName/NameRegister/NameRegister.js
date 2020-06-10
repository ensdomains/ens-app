import React, { useState, useReducer } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { Query, useQuery } from 'react-apollo'
import moment from 'moment'
import {
  GET_MINIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  GET_PREMIUM,
  GET_TIME_UNTIL_PREMIUM,
  GET_USD_RATE
} from 'graphql/queries'
import { useInterval, useEthPrice } from 'components/hooks'
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
import { formatDate } from 'utils/dates'
import DefaultInput from '../../Forms/Input'

const NameRegisterContainer = styled('div')`
  padding: 20px 40px;
`

const Input = styled(DefaultInput)`
  display: inline-block;
  width: 8em;
`

const PremiumWarning = styled('div')`
  background-color: #f5a623;
  color: white;
  padding: 1em;
  margin-bottom: 1em;
`

const WaitUntil = styled('span')`
  color: red;
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
  const [premium, setPremium] = useState(0)

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
  const { data: { getUSDRate } = {}, loading: getUSDRateLoading } = useQuery(
    GET_USD_RATE
  )
  // TODO: find out why I cannot use EthVal
  let usdRate = getUSDRate / Math.pow(10, 18)
  window.EthVal = EthVal
  console.log('*** getUSDRate', { usdRate })
  const {
    data: { getTimeUntilPremium } = {},
    loading: getTimeUntilPremiumLoading
  } = useQuery(GET_TIME_UNTIL_PREMIUM, {
    variables: {
      expires: expiryTime,
      amount: premium
    }
  })
  const releasedDate = moment(expiryTime * 1000).add(90, 'days')
  let zeroPremiumDate, premiumInEth
  if (getTimeUntilPremium) {
    zeroPremiumDate = new Date(getTimeUntilPremium.toNumber() * 1000)
  }
  if (getPremium) {
    premiumInEth = new EthVal(getPremium.toString()).toEth().toFixed(2)
  }

  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds
  const isAboveMinDuration = parsedYears > twentyEightDaysInYears
  const waitPercentComplete = (secondsPassed / waitTime) * 100

  if (!registrationOpen) return <NotAvailable domain={domain} />
  console.log({ premiumInEth, premium })
  const handleChange = evt => {
    const { name, value } = evt.target
    if (!isNaN(value) && parseFloat(premiumInEth) >= parseFloat(premium)) {
      console.log({ value })
      const valueInWei = new window.EthVal(value, 'eth').toWei().toString(16)
      console.log('*** setPremium', { premiumInEth, premium, valueInWei })
      setPremium(valueInWei)
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
          ethUsdPrice={ethUsdPrice}
          loading={rentPriceLoading}
          price={getRentPrice}
        />
      )}
      {releasedDate && getTimeUntilPremium && getPremium ? (
        <PremiumWarning>
          <h2>This name is currently sold at premium</h2>
          <p>
            This is because this name was just released on{' '}
            {formatDate(releasedDate)}. To prevent people rashing into buying
            names with high gas price. We sell newly released names with higher
            premium which becomes lower with time.
          </p>
          <ul>
            <li>The current premium is {premiumInEth} ETH.</li>
            <li>
              To have{' '}
              <Input wide={false} placeholder={0} onChange={handleChange} /> ETH
              premium, please wait till{' '}
              <WaitUntil>{formatDate(zeroPremiumDate)}</WaitUntil>.
            </li>
          </ul>
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

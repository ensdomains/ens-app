import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils/dates'
import debounce from 'lodash/debounce'
import mq from 'mediaQuery'

import { ReactComponent as ChainDefault } from '../../Icons/chain.svg'

import DefaultInput from '../../Forms/Input'
import AddToCalendar from '../../Calendar/ReleaseCalendar'

const PremiumContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  margin-top: 20px;
  ${mq.medium`
    grid-template-columns:
      minmax(min-content, 200px) minmax(min-content, min-content)
      minmax(200px, 1fr) minmax(200px, min-content);
  `}
`
const Chain = styled(ChainDefault)`
  display: none;

  ${mq.medium`
    display: block;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  `}
`

const AmountContainer = styled('div')`
  ${mq.medium`
    max-width: 220px;
  `}
`

const DateContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
`

const CalendarContainer = styled('div')`
  margin-top: 1em;
  ${mq.medium`
    margin: auto;
    max-width: 220px;
  `}
`

const Value = styled('div')`
  font-family: Overpass;
  font-weight: 100;
  font-size: 22px;
  color: ${p => (p.invalid ? 'red' : '#2b2b2b')};
  border-bottom: 1px solid #dbdbdb;
  ${mq.small`
    font-size: 28px;
  `}
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const Input = styled(DefaultInput)`
  display: inline-block;
  width: 8em;
  margin-bottom: 0em;
`

function Premium({
  name,
  invalid,
  className,
  reference,
  handlePremium,
  estimateValue,
  timeUntilPremium
}) {
  const [value, setValue] = useState(estimateValue)
  const { t } = useTranslation()
  const debouncedHandlePremium = debounce(handlePremium, 1000)
  return (
    <PremiumContainer className={className} ref={reference}>
      <AmountContainer>
        <Input
          invalid={invalid}
          wide={false}
          placeholder={'$0'}
          value={value}
          onChange={evt => {
            console.log('*** evt', estimateValue, evt.target.value)
            setValue(evt.target.value)
            debouncedHandlePremium(evt.target)
          }}
        />
        <Description>{t('register.premium.title')}</Description>
      </AmountContainer>
      <Chain />
      <DateContainer>
        <Value invalid={invalid}>
          {invalid
            ? t('register.premium.invalid')
            : `${formatDate(timeUntilPremium)}`}
        </Value>
        <Description>{t('register.premium.dateDescription')}</Description>
      </DateContainer>
      <CalendarContainer>
        <AddToCalendar
          css={css`
            margin-right: 20px;
          `}
          name={name}
          startDatetime={timeUntilPremium.utc().subtract(1, 'hour')}
          invalid={invalid}
        />
      </CalendarContainer>
    </PremiumContainer>
  )
}

export default Premium

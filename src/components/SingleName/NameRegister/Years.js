import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'

const YearsContainer = styled('div')`
  ${mq.medium`
    max-width: 220px;
  `}
`

const Stepper = styled('div')`
  display: grid;
  grid-template-columns:
    30px auto
    30px;
  border-bottom: 1px solid #dfdfdf;
`

const Icon = styled('div')`
  font-family: Overpass;
  font-size: 28px;
  font-weight: 100;
  color: #adbbcd;
  border-radius: 50%;
  border: solid #adbbcd 1px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  transition: 0.2s;

  &:hover {
    border: solid #2500a6 1px;
    color: #2500a6;
    cursor: pointer;
  }
`

const Amount = styled('div')`
  width: 150px;
  padding-left: 20px;
  display: flex;
  font-family: Overpass;
  font-size: 28px;
  font-weight: 100;
  color: #2b2b2b;
  justify-self: left;
  align-self: center;

  input {
    background: transparent;
    font-family: Overpass;
    font-size: 28px;
    font-weight: 100;
    color: #2b2b2b;
    border: none;
    max-width: 45px;
    outline: 0;
  }
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const Years = ({ years, setYears }) => {
  const { t } = useTranslation()
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years > 1 ? setYears(years - 1) : null)
  return (
    <YearsContainer>
      <Stepper>
        <Icon onClick={decrementYears}>-</Icon>
        <Amount>
          <input
            type="text"
            value={years}
            onChange={e => {
              const sign = Math.sign(e.target.value)
              if (sign === -1 || isNaN(sign)) {
                setYears(0)
              } else {
                setYears(e.target.value)
              }
            }}
          />{' '}
          year{years > 1 && 's'}
        </Amount>
        <Icon onClick={incrementYears}>+</Icon>
      </Stepper>
      <Description>{t('pricer.rentalPeriodLabel')}</Description>
    </YearsContainer>
  )
}

export default Years

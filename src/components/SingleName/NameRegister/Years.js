import React, { useState } from 'react'
import styled from 'react-emotion'

const YearsContainer = styled('div')`
  display: flex;
  align-items: center;
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

  &:hover {
    cursor: pointer;
  }
`

const Amount = styled('div')`
  font-family: Overpass;
  font-size: 28px;
  font-weight: 100;
  color: #2b2b2b;
  width: 130px;
  padding-left: 20px;
`

const Years = ({ years, setYears }) => {
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years > 1 ? setYears(years - 1) : null)
  return (
    <YearsContainer>
      <Icon onClick={decrementYears}>-</Icon>
      <Amount>
        {years} year{years > 1 && 's'}
      </Amount>
      <Icon onClick={incrementYears}>+</Icon>
    </YearsContainer>
  )
}

export default Years

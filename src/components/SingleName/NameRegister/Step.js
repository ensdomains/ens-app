import React from 'react'
import styled from '@emotion/styled/macro'

const offset = 180

const Number = styled('div')`
  color: ${p => (p.progress === 100 ? '#42E068' : '#dfdfdf')};
  font-size: 34px;
  font-weight: 300;
  position: relative;
  width: 60px;
  height: 60px;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const SVG = styled('svg')`
  stroke: #ccc;

  circle {
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
  }

  circle.progress {
    stroke-dasharray: ${offset};
    stroke-dashoffset: ${p => (offset / 100) * (p.progress - 100)};
  }
`

const Content = styled('div')`
  margin-left: 8px;

  h3 {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    margin-top: 0;
  }
`

const StepContainer = styled('div')`
  display: flex;
`

const Step = ({ number, text, title, progress = 100 }) => (
  <StepContainer>
    <Number progress={progress}>
      <SVG height="60" width="60" progress={progress}>
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke="#dfdfdf"
          strokeWidth="2"
          fill="none"
          transform="rotate(-90, 30, 30)"
        />
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke-width="2"
          stroke="#42E068"
          fill="none"
          className="progress"
          transform="rotate(-90, 30, 30)"
        />
      </SVG>
      <span>{number}</span>
    </Number>
    <Content>
      <h3>{title}</h3>
      <p>{text}</p>
    </Content>
  </StepContainer>
)

export default Step

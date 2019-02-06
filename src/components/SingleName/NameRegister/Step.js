import React from 'react'
import styled from 'react-emotion'

const offset = 180

const Number = styled('div')`
  font-size: 34px;
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

const Step = ({ number, text, progress = 100 }) => (
  <div>
    <Number>
      <SVG height="60" width="60" progress={progress}>
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke-width="2"
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
    <p>{text}</p>
  </div>
)

export default Step

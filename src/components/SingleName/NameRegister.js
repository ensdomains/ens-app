import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'

const Year = () => <div>2</div>

const Price = () => <div>0.98 ETH</div>

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

const Explainer = () => (
  <div>
    <h2>Registering a name requires you to complete 3 steps:</h2>
    <p>
      *Favorite the name for easy access in case you close out of your browser.
    </p>
    <Step
      number={1}
      text="Metamask will open and you will be asked to confirm the first of two transactions required for registration. "
    />
    <Step
      number={2}
      progress={75}
      text="There will be a 10+ minute waiting period before Metamask will ask you to confirm the second transaction."
    />
    <Step
      number={3}
      progress={0}
      text="After completing the two transactions, the register button will be active. Click ‘register’ to finalize ownership of the name."
    />
  </div>
)

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const CTA = () => (
  <CTAContainer>
    <Button type="hollow" style={{ marginRight: '20px' }}>
      Cancel
    </Button>
    <Button>Request to register</Button>
  </CTAContainer>
)

const NameRegisterContainer = styled('div')`
  padding: 20px 40px;
`

const NameRegister = ({ domain }) => {
  return (
    <NameRegisterContainer>
      <Year />
      <Price />
      <Explainer />
      <CTA />
    </NameRegisterContainer>
  )
}

export default NameRegister

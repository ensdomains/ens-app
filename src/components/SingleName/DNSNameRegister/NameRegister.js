import React, { useReducer } from 'react'
import styled from '@emotion/styled'
import { registerMachine, registerReducer } from './registerReducer'

import Explainer from './Explainer'
import CTA from './CTA'
import { SingleNameBlockies } from '../SingleNameBlockies'
import DefaultEtherScanLink from '../../Links/EtherScanLink'

import dnssecmodes from '../../../api/dnssecmodes'
import You from '../../Icons/You'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
  svg {
    flex-grow: 1;
  }
`

const NameRegisterContainer = styled('div')`
  padding: 20px 40px;
`

const Title = styled('span')`
  color: ${p => p.color};
`

const Address = styled('span')`
  color: #d8d8d8;
`

const DNSOwnerContainer = styled('div')`
  background: #f0f6fa;
  display: flex;
  padding: 1em 0;
  *{
    padding-left 24px;
  }
`

const BreadcrumbsCaontainer = styled('ul')`
  background: #f0f6fa;
  list-style: none;
  overflow: hidden;
  display: flex;
  padding: 1em;
  li {
    border-right: 1px solid #adbbcd;
    text-align: center;
    flex: auto;
  }
  li a {
    color: white;
    text-decoration: none;
    padding: 10px 0 10px 65px;
    background: brown; /* fallback color */
    background: hsla(34, 85%, 35%, 1);
    position: relative;
    display: block;
    float: left;
  }

  li:last-child {
    border-right: none;
  }
`
const NumberContainer = styled('span')`
  margin-right: 0.5em;
`

const Number = ({ number, currentNumber, text }) => {
  const green = '#42E068'
  const grey = '#D8D8D8'
  const black = '#2B2B2B'
  const displayNumber = number < currentNumber ? '✓' : number
  let color
  if (number === currentNumber) {
    color = black
  } else if (number < currentNumber) {
    color = green
  } else {
    color = grey
  }

  return (
    <>
      <NumberContainer>
        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-694.000000, -314.000000)">
              <g transform="translate(404.000000, 183.000000)">
                <g transform="translate(37.000000, 119.000000)">
                  <g transform="translate(253.000000, 9.000000)">
                    <g transform="translate(0.000000, 2.000000)">
                      <circle fill={color} cx="6" cy="7" r="6" />
                      <text
                        font-family="Helvetica"
                        font-size="10"
                        font-weight="normal"
                        letter-spacing="0.3125"
                        fill="#F0F6FA"
                      >
                        <tspan x="2.8" y="10">
                          {displayNumber}
                        </tspan>
                      </text>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </NumberContainer>
      <Title color={color}>{text}</Title>
    </>
  )
}

const getContent = (step, account, dnsOwner) => {
  let content = {
    ENABLE_DNSSEC: {
      title:
        'Visit your domain registrar to enable DNSSEC. Once enabled, click refresh to see if you can move to the next step.',
      text: "Click 'learn more' to read about the process.",
      number: 1
    },
    ADD_TEXT: {
      title: (
        <>
          Set up a text record in your domain registrar, then click refresh. The
          text record should contain your Ethereum address in the form:{' '}
          <Address>a={account}</Address>
        </>
      ),
      text: "Click 'learn more' to read about the process.",
      number: 2
    },
    SUBMIT_PROOF: [
      {
        title:
          'You are the owner of this address. Add your domain to the ENS Registry now.',
        text:
          'The address that appears in the DNS txt record is your same address.',
        number: 3,
        owner: true
      },
      {
        title:
          "You don't appear to be the DNS Owner of this domain, but anyone can add this domain to the ENS Registry. ",
        text:
          "If you know you own this domain, change it's TXT record to contain your Ethereum Address and refresh this page to perform the DNSSEC verification again.",
        number: 3
      }
    ],
    SUBMIT_SENT: [
      {
        title:
          'You are the owner of this address. Add your domain to the ENS Registry now.',
        text:
          'The address that appears in the DNS txt record is your same address.',
        number: 3,
        owner: true
      },
      {
        title:
          "You don't appear to be the DNS Owner of this domain, but anyone can add this domain to the ENS Registry. ",
        text:
          "If you know you own this domain, change it's TXT record to contain your Ethereum Address and refresh this page to perform the DNSSEC verification again.",
        number: 3
      }
    ],
    SUBMIT_CONFIRMED: [
      {
        title:
          'Congratulations! You have successfully added this DNS domain to the ENS Registry.',
        text: 'Since you are the owner, you can manage your name now. ',
        number: 4,
        owner: true
      },
      {
        title:
          'Congratulations! You have successfully added this DNS domain to the ENS Registry.',
        text:
          'Since you are not the owner, you can only view the name in the manager.',
        number: 4
      }
    ]
  }[step]
  if (content.length >= 0) {
    content =
      dnsOwner.toLowerCase() === account.toLowerCase() ? content[0] : content[1]
  }
  return content
}

const NameRegister = ({ account, domain, refetch, readOnly }) => {
  const dnssecmode = dnssecmodes[domain.state]
  let [step, dispatch] = useReducer(
    registerReducer,
    dnssecmode.state || registerMachine.initialState
  )
  const incrementStep = () => dispatch('NEXT')
  const content = getContent(step, account, domain.dnsOwner)
  const showDNSOwner =
    domain.dnsOwner &&
    [2, 3, 4].includes(content.number) &&
    parseInt(domain.dnsOwner) !== 0
  return (
    <NameRegisterContainer>
      <BreadcrumbsCaontainer>
        <li>
          <Number
            number={1}
            currentNumber={content.number}
            text="ENABLE DNSSEC"
          />{' '}
        </li>
        <li>
          <Number number={2} currentNumber={content.number} text="ADD TEXT" />
        </li>
        <li>
          <Number
            number={3}
            currentNumber={content.number}
            text="SUBMIT PROOF"
          />
        </li>
        <li>
          <Number
            number={4}
            currentNumber={content.number}
            text="MANAGE NAME"
          />
        </li>
      </BreadcrumbsCaontainer>
      <Explainer
        step={step}
        border={!showDNSOwner}
        number={content.number}
        title={content.title}
        text={content.text}
      />
      {showDNSOwner ? (
        <DNSOwnerContainer>
          <span>DNS Owner {content.owner ? <You /> : null}</span>
          <EtherScanLink address={domain.dnsOwner}>
            <SingleNameBlockies address={domain.dnsOwner} imageSize={24} />
            {domain.dnsOwner}
          </EtherScanLink>
        </DNSOwnerContainer>
      ) : null}
      <CTA
        name={domain.name}
        parentOwner={domain.parentOwner}
        incrementStep={incrementStep}
        step={step}
        error={dnssecmode.displayError ? dnssecmode.title : null}
        state={domain.state}
        label={domain.label}
        refetch={refetch}
        readOnly={readOnly}
      />
    </NameRegisterContainer>
  )
}

const NameRegisterDataWrapper = props => {
  return <NameRegister {...props} />
}

export default NameRegisterDataWrapper

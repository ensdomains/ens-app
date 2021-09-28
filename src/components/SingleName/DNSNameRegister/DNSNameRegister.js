import React, { useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { registerMachine, registerReducer } from './registerReducer'

import Explainer from './Explainer'
import CTA from './CTA'
import { SingleNameBlockies } from '../../Blockies'
import DefaultEtherScanLink from '../../Links/EtherScanLink'

import dnssecmodes from '../../../api/dnssecmodes'
import You from '../../Icons/You'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
  overflow: hidden;
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
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-694.000000, -314.000000)">
              <g transform="translate(404.000000, 183.000000)">
                <g transform="translate(37.000000, 119.000000)">
                  <g transform="translate(253.000000, 9.000000)">
                    <g transform="translate(0.000000, 2.000000)">
                      <circle fill={color} cx="6" cy="7" r="6" />
                      <text
                        fontFamily="Helvetica"
                        fontSize="10"
                        fontWeight="normal"
                        letterSpacing="0.3125"
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

const getContent = (step, account, dnsOwner, t) => {
  let content = {
    ENABLE_DNSSEC: {
      title: t('dns.steps.enable.title'),
      text: t('dns.steps.enable.title'),
      number: 1
    },
    ADD_TEXT: {
      title: (
        <>
          {t('dns.steps.addtext.title')}
          <Address>a={account}</Address>
        </>
      ),
      text: t('dns.steps.addtext.text'),
      number: 2
    },
    SUBMIT_PROOF: [
      {
        title: t('dns.steps.proof.title1'),
        text: t('dns.steps.proof.text1'),
        number: 3,
        owner: true
      },
      {
        title: t('dns.steps.proof.title2'),
        text: t('dns.steps.proof.text2'),
        number: 3
      }
    ],
    SUBMIT_SENT: [
      {
        title: t('dns.steps.proof.title1'),
        text: t('dns.steps.proof.text1'),
        number: 3,
        owner: true
      },
      {
        title: t('dns.steps.proof.title2'),
        text: t('dns.steps.proof.text2'),
        number: 3
      }
    ],
    SUBMIT_CONFIRMED: [
      {
        title: t('dns.steps.manage.title'),
        text: t('dns.steps.manage.text1'),
        number: 4,
        owner: true
      },
      {
        title: t('dns.steps.manage.title'),
        text: t('dns.steps.manage.text2'),
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

const NameRegister = ({
  account,
  domain,
  refetch,
  readOnly,
  registrarAddress
}) => {
  const { t } = useTranslation()
  const dnssecmode = dnssecmodes[domain.state]
  let [step, dispatch] = useReducer(
    registerReducer,
    dnssecmode.state || registerMachine.initialState
  )
  const incrementStep = () => dispatch('NEXT')
  const content = getContent(step, account, domain.dnsOwner, t)
  const errorMessage =
    dnssecmode.displayError && (domain.stateError || dnssecmode.title)
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
            text={t('dns.breadcrumbs.0')}
          />{' '}
        </li>
        <li>
          <Number
            number={2}
            currentNumber={content.number}
            text={t('dns.breadcrumbs.1')}
          />
        </li>
        <li>
          <Number
            number={3}
            currentNumber={content.number}
            text={t('dns.breadcrumbs.2')}
          />
        </li>
        <li>
          <Number
            number={4}
            currentNumber={content.number}
            text={t('dns.breadcrumbs.3')}
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
          <span>
            {t('dns.dnsowner')} {content.owner ? <You /> : null}
          </span>
          <EtherScanLink address={domain.dnsOwner}>
            <SingleNameBlockies address={domain.dnsOwner} imageSize={24} />
            {domain.dnsOwner}
          </EtherScanLink>
        </DNSOwnerContainer>
      ) : null}
      <CTA
        name={domain.name}
        parentOwner={registrarAddress}
        incrementStep={incrementStep}
        step={step}
        error={errorMessage}
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

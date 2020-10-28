import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import Button from '../Forms/Button'
import warning from '../../assets/warning.svg'
import write from '../../assets/Write.svg'

import mq from 'mediaQuery'

const ConfirmContainer = styled('div')`
  &:before {
    display: none;
    background: url(${write});
    content: '';
    height: 43px;
    width: 42px;
    float: right;
    ${mq.large`
      display: block;
      flex-direction: row;
    `}
  }
`
const Content = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const Title = styled('h3')`
  margin: 0 0 0 1.5em;
  font-size: 16px;
  font-weight: 300;
  ${mq.small`
    font-size: 22px;
  `}
  &:before {
    background: url(${warning});
    content: '';
    height: 17px;
    width: 19px;
    position: absolute;
    margin-left: -1.4em;
    margin-top: 0.2em;
  }
`

const SubTitle = styled('p')`
  margin: 0;
  margin-bottom: 1em;
  font-size: 12px;
  ${mq.small`
    font-size: 14px;
  `}
`

const Values = styled('ul')`
  list-style-type: none;
  padding: 4px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Value = styled('li')`
  font-size: 12px;
  font-weight: bold;
  font-family: Overpass Mono;
  display: flex;
  justify-content: space-between;
  color: ${({ old }) => (old ? 'grey' : 'black')};
  margin-bottom: 10px;

  ${mq.large`
    justify-content: flex-start;
  `}

  span:first-child {
    width: 75px;
  }
`

const Buttons = styled('div')`
  height: 100%;
  margin-top: 1em;
  display: flex;
`

const Action = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const Confirm = ({
  mutation,
  cancel,
  disabled,
  className,
  value,
  extraDataComponent,
  newValue,
  explanation
}) => {
  const { t } = useTranslation()
  return (
    <ConfirmContainer className={className}>
      <Title>{t('singleName.confirm.title')}</Title>
      <SubTitle>{t('singleName.confirm.subTitle')}</SubTitle>
      <Content>
        {explanation ? <p>{explanation}</p> : ''}
        {extraDataComponent ? <>{extraDataComponent}</> : ''}
        {value || newValue ? (
          <Values>
            <Value old={true}>
              <span>{t('singleName.confirm.value.previous')}</span>
              <span>{value}</span>
            </Value>
            <Value>
              <span>{t('singleName.confirm.value.future')}</span>
              <span>{newValue}</span>
            </Value>
          </Values>
        ) : (
          ''
        )}
        <Buttons>
          <Cancel type="hollow" onClick={cancel}>
            {t('singleName.confirm.button.cancel')}
          </Cancel>
          {disabled ? (
            <Action type="disabled" data-testid="send-transaction">
              {t('singleName.confirm.button.confirm')}
            </Action>
          ) : (
            <Action
              data-testid="send-transaction"
              onClick={() => {
                mutation()
                cancel()
              }}
            >
              {t('singleName.confirm.button.confirm')}
            </Action>
          )}
        </Buttons>
      </Content>
    </ConfirmContainer>
  )
}

export default Confirm

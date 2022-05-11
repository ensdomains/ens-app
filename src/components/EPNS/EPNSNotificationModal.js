import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  default as Button,
  getButtonDefaultStyles,
  getButtonStyles
} from '../Forms/Button'
import Loader from '../Loader'
import { useWeb3Data } from './useWeb3'
import { selectConfig, isUserSubscribed, optIn, optOut } from './EPNSUtil'
import OnSubscribedModal from './EPNSOnSubscribeModal'
import NetworkSwitch from './SwitchNetwork'

const LoadingComponent = styled(Loader)`
  display: inline-block;
  margin: 0 10px;
  vertical-align: middle;
`

const FormComponent = styled('form')`
  display: grid;
  grid-gap: 10px;
  font-weight: 200;
`

const FormLabel = styled('label')`
  display: block;
  margin-top: 20px;
`

const FormWarning = styled('div')`
  color: #f5a623;
  margin-bottom: 10px;
`

const FormError = styled(FormLabel)`
  color: red;
  font-size: 0.8rem;
`

const Header = styled('h3')`
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0;
`

const Row = styled('div')`
  padding: 10px 0 30px;
`

const MessageBlock = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`
const Actions = styled('div')`
  display: flex;
  justify-content: right;
`

const buttonStyles = `
  margin: 5px;
  position: relative;
`

const CancelComponent = styled(Button)`
  ${getButtonDefaultStyles()}
  ${getButtonStyles({ type: 'hollow' })}
  ${buttonStyles}
 `

const EPNSNotificationModal = ({ address, onCancel }) => {
  const { t } = useTranslation()

  const { signer, networkId } = useWeb3Data()
  const [epnsConfig, setEpnsConfig] = useState({})
  const [isChannelSubscribed, setIsChannelSubscribed] = useState()
  const [isLoading, setIsLoading] = useState()
  const [isError, setError] = useState()
  const [networkSupported, setNetworkSupported] = useState() // epns api don't support ropsten
  const [isModalOpen, setIsModalOpen] = useState()

  const isWeb3Ready = signer && address && networkId
  const disableButton = !networkSupported || isError
  const buttonType = disableButton ? 'disabled' : 'primary'

  const handleSubmit = e => {
    e.preventDefault()
  }

  async function callOptIn() {
    setIsLoading(true)

    await optIn(signer, epnsConfig.CHANNEL_ADDRESS, networkId, address, {
      baseApiUrl: epnsConfig.API_BASE_URL,
      onSuccess: () => {
        setIsChannelSubscribed(true)
        setIsLoading(false)
        setIsModalOpen(true)
      },
      onError: err => {
        setError(true)
        setIsLoading(false)
      }
    })
  }

  async function callOptOut() {
    setIsLoading(true)

    await optOut(signer, epnsConfig.CHANNEL_ADDRESS, networkId, address, {
      baseApiUrl: epnsConfig.API_BASE_URL,
      onSuccess: () => {
        setIsChannelSubscribed(false)
        setIsLoading(false)
      },
      onError: err => {
        setError(true)
        setIsLoading(false)
      }
    })
  }

  const toggleSubscription = () => {
    if (!isChannelSubscribed) {
      callOptIn()
    } else {
      callOptOut()
    }
  }

  const toggleModal = () => {
    setIsModalOpen(value => !value)
  }

  async function fetchAndUpdateSubscription() {
    try {
      setIsLoading(true)
      const status = await isUserSubscribed(
        address,
        epnsConfig.CHANNEL_ADDRESS,
        epnsConfig.API_BASE_URL
      )
      setIsChannelSubscribed(status)
    } catch (err) {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // determine the config
    if (networkId) {
      setEpnsConfig(selectConfig(networkId))
    }
  }, [networkId])

  useEffect(() => {
    // fetch the channel details if we have config
    const isSupprtedNW = Object.keys(epnsConfig).length > 0
    if (isSupprtedNW) {
      fetchAndUpdateSubscription()
    }

    setNetworkSupported(isSupprtedNW)
  }, [epnsConfig])

  return (
    <FormComponent onSubmit={handleSubmit}>
      <FormLabel htmlFor="epns">
        <Header>{t('epns.modal.header')}</Header>
      </FormLabel>

      <Row>
        <Button type="hollow-primary" onClick={toggleModal}>
          {t('epns.modal.platforms')}
        </Button>
      </Row>

      {isWeb3Ready ? (
        <Row>
          {isLoading ? (
            <LoadingComponent />
          ) : isChannelSubscribed ? (
            <Button
              onClick={toggleSubscription}
              type={buttonType}
              disabled={disableButton}
            >
              {t('epns.modal.optOutButton')}
            </Button>
          ) : (
            <Button
              onClick={toggleSubscription}
              type={buttonType}
              disabled={disableButton}
            >
              {t('epns.modal.optInButton')}
            </Button>
          )}

          {!networkSupported ? (
            <MessageBlock>
              <FormWarning>{t('epns.modal.unsupportedNetwork')}</FormWarning>
              <NetworkSwitch>{t('epns.modal.switchNetwork')}</NetworkSwitch>
            </MessageBlock>
          ) : null}
          {isError ? <FormError> {t('epns.modal.apiError')}</FormError> : null}
        </Row>
      ) : (
        <LoadingComponent />
      )}

      <Actions>
        <CancelComponent onClick={onCancel}>{t('c.cancel')}</CancelComponent>
      </Actions>

      {/* OnSubscribeModal */}
      {isModalOpen ? <OnSubscribedModal onClose={toggleModal} /> : null}
    </FormComponent>
  )
}

export default EPNSNotificationModal

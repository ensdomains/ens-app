import React, { useContext } from 'react'
import styled from '@emotion/styled/macro'
import GlobalState from '../../globalState'
import mq from 'mediaQuery'

function Modal({ small, name, children, component: Component }) {
  const { currentModal, toggleModal } = useContext(GlobalState)
  if (!currentModal || name !== currentModal.name) {
    return null
  }
  return (
    <ModalContainer
      show={name === currentModal.name}
      onClick={event => {
        event.stopPropagation()
        toggleModal({ name })
      }}
    >
      <ModalContent onClick={event => event.stopPropagation()} small={small}>
        {Component ? (
          <Component {...currentModal} />
        ) : currentModal.render ? (
          currentModal.render({ ...this.props, toggleModal })
        ) : null}
        {children}
      </ModalContent>
    </ModalContainer>
  )
}

const ModalContainer = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  ${mq.small`
    padding: 20px;
  `};
`

const ModalContent = styled('div')`
  background: white;
  padding: 20px;
  overflow-y: scroll;
  height: auto;
  ${mq.medium`
    padding: 40px;
    width: 70%;
  `};

  ${mq.large`
    width: 50%;
  `};

  ${p =>
    p.small
      ? `
    height: auto;
    width: auto;
  `
      : null};
`

export default Modal

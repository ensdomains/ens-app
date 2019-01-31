import React, { useContext } from 'react'
import styled from 'react-emotion'
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
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999;
  background: rgba(0, 0, 0, 0.5);
`

const ModalContent = styled('div')`
  background: white;
  padding: 40px;
  overflow-y: scroll;
  height: auto%;
  min-width: 850px;
  ${mq.medium`
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

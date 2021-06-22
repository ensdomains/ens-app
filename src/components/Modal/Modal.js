import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled/macro'
import GlobalState from '../../globalState'
import mq from 'mediaQuery'

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

function Modal({ small, children, closeModal }) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <ModalContainer show onClick={closeModal}>
      <ModalContent onClick={event => event.stopPropagation()} small={small}>
        {children}
      </ModalContent>
    </ModalContainer>,
    modalRoot
  )
}

export default Modal

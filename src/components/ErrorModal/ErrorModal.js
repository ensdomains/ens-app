import React from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'

const ModalContainer = styled('div')`
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 100000000;
  left: 0;
  top: 0;
`

export default function ErrorModal({ title, error, close }) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <ModalContainer onClick={close}>
      {title} {JSON.stringify(error)}
      <div>Okay</div>
    </ModalContainer>,
    modalRoot
  )
}

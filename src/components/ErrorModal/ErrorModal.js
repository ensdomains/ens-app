import React from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

import Button from 'components/Forms/Button'

const ModalBackground = styled('div')`
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #2b2b2b;
  z-index: 100000000;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled('div')`
  background: white;
  padding: 15px 20px;
  width: 90%;
  ${mq.medium`
    width: 50%
  `}
`

const ErrorTitle = styled('h2')`
  color: red;
  font-weight: 300;
  font-size: 22px;
  margin-top: 0;
`

const ErrorMessage = styled('pre')`
  white-space: normal;
`

const WarningIcon = (
  <svg width="25" height="22" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.165 6.51c.658-.16 1.344.16 1.618.77a1.8 1.8 0 01.137.664 49.926 49.926 0 01-.137 2.02c-.055 1.036-.137 2.099-.192 3.135-.027.345-.027.372-.027.717a1.021 1.021 0 01-1.042.984c-.576 0-1.015-.399-1.042-.957-.082-1.62-.192-2.976-.274-4.597l-.083-1.302a1.41 1.41 0 011.042-1.434m.357 12.222c-.768 0-1.399-.611-1.399-1.355s.631-1.355 1.399-1.355c.767 0 1.398.61 1.37 1.381.028.718-.63 1.329-1.37 1.329M3.749 22H21.24c2.879 0 4.688-3.056 3.263-5.447l-8.774-14.72c-1.425-2.444-5.044-2.444-6.47 0L.486 16.553C-.912 18.971.87 22 3.749 22"
      fill="#DC2E2E"
      fillRule="evenodd"
    />
  </svg>
)

const ButtonContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`
export default function ErrorModal({ title, error, close }) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <ModalBackground onClick={close}>
      <Content onClick={event => event.stopPropagation()}>
        <ErrorTitle>
          {WarningIcon} &nbsp;
          {title}
        </ErrorTitle>
        <ErrorMessage>{JSON.stringify(error)}</ErrorMessage>
        <ButtonContainer>
          <Button type="primary" onClick={close}>
            Close
          </Button>
        </ButtonContainer>
      </Content>
    </ModalBackground>,
    modalRoot
  )
}

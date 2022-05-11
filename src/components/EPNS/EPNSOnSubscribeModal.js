import React from 'react'
// import * as ReactUse from "react-use";
import styled from '@emotion/styled'
import { LINKS, CLOSE_ICON } from './EPNSUtil'
import { useOnClickOutside } from 'components/hooks'

const OnSubscribedModal = ({ onClose }) => {
  const modalRef = React.useRef(null)
  // dummy function to help navigate to another page
  const goto = url => {
    window.open(url, '_blank')
  }

  //  ReactUse.useClickAway(modalRef, onClose);
  useOnClickOutside([modalRef], () => onClose())

  return (
    <Overlay className="overlay">
      <Modal className="modal" ref={modalRef}>
        <img onClick={onClose} src={CLOSE_ICON} alt="" />
        <Item className="modal__heading">
          <CustomHeaderTwo>
            <CustomSpan style={{ marginRight: '10px' }}>Recieve</CustomSpan>
            <StyledSpan>Notifications</StyledSpan>
          </CustomHeaderTwo>
          <H3>
            Recieve notifications from <b>EPNS</b> via the following platforms.
          </H3>
        </Item>

        <Item className="modal__content">
          {LINKS.map((oneLink, idx) => (
            <ItemLink onClick={() => goto(oneLink.link)} key={idx}>
              <img src={oneLink.img} alt="" />
              {oneLink.text}
            </ItemLink>
          ))}
        </Item>
      </Modal>
    </Overlay>
  )
}

const ItemLink = styled.div`
  width: 260px;
  height: 62px;
  padding-left: 22px;

  background: #fafafa;
  border: 0.2px solid rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 0.75em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 1.3125em;

  cursor: pointer;
  transition: 300ms;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`
const CustomHeaderTwo = styled.h2`
  margin-top: 0;
  margin-bottom: 1em;
  color: rgb(0, 0, 0);
  font-weight: 600;
  font-size: 1.5625em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0px;
  font-family: inherit;
  text-align: inherit;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: capitalise;

  &.modal__heading {
    margin-bottom: 3.3125rem;
  }

  &.modal__content {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-row-gap: 3.3125em;
  }
`

const CustomSpan = styled.span`
  flex: initial;
  align-self: auto;
  color: rgb(0, 0, 0);
  background: transparent;
  font-weight: 400;
  font-size: inherit;
  text-transform: inherit;
  margin: 0px;
  padding: 0px;
  letter-spacing: inherit;
  text-align: initial;
  position: initial;
  inset: auto;
  z-index: auto;
`

const StyledSpan = styled(CustomSpan)`
  background: rgb(226, 8, 128);
  color: #fff;
  font-weight: 600;
  padding: 3px 8px;
`

const H3 = styled.h3`
  color: rgb(0 0 0 / 0.5);
  font-weight: 300;
  font-size: 1em;
  text-transform: uppercase;
  margin: -15px 0px 20px 0px;
  padding: 0px;
  letter-spacing: 0.1em;
  font-family: 'Source Sans Pro', Helvetica, sans-serif;
  text-align: inherit;
  max-width: initial;
`

const Overlay = styled.div`
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  height: 100%;
  width: 100%;
  z-index: 1000;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
`

const Modal = styled.div`
  padding: 3.875em;
  background: white;
  text-align: left;
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  position: relative;

  & > img {
    position: absolute;
    right: 40px;
    top: 40px;
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    width: max(70vw, 350px);
    padding: 2em;
    .modal__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  }
`

export default OnSubscribedModal

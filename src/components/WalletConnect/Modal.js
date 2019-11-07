import React, {useState, useMemo, useRef} from 'react'
import {createPortal} from 'react-dom'
import styled from '@emotion/styled'

const OuterModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    background-color: rgba(0,0,0,0.5);
`

const InnerModal = styled.div`
    position: relative;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 12px 24px 0 rgba(0,0,0,0.1);
    max-width: 500px;
`

const ModalCloseButton = styled.span`
    position: absolute;
    font-size: 2em;
    top: 0.3em;
    right: 0.5em;
    cursor: pointer;
    color: #7C828B;
`

export const Modal = ({children, isOpen, close}) => {
    if (!isOpen) return null

    return createPortal(
        <OuterModal>
            <InnerModal>
                {close && <ModalCloseButton onClick={close}>×</ModalCloseButton>}
                {children}
            </InnerModal>
        </OuterModal>,
        document.body
    )
}

export const useModal = ({onClose, onOpen} = {}) => {
    const [isOpen, setOpenState] = useState(false)
    const isOpenRef = useRef(isOpen)
    const setOpen = open => {
        isOpenRef.current = open
        setOpenState(open)
    }

    const toggle = () => {
        if (isOpenRef.current) {
            setOpen(false)
            onClose && onClose()
        } else {
            setOpen(true)
            onOpen && onOpen()
        }
    }

    const open = () => {
        if (!isOpenRef.current) {
            setOpen(true)
            onOpen && onOpen()
        }
    }

    const close = () => {
        if (isOpenRef.current) {
            setOpen(false)
            onClose && onClose()
        }
    }

    return [{
        isOpen,
        close,
    }, {
        toggle,
        open,
        close,
    }]
}


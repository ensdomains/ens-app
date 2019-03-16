import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import uuid from 'uuid'
import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

const DefaultTooltip = styled(ReactTooltip)`
  box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
  opacity: 1 !important;
`

const TooltipContainer = props => {
  const { text, position, children } = props
  const id = uuid()
  const [show, setShow] = useState(false)
  const tooltipRef = React.createRef()

  useEffect(() => {
    if (show) {
      ReactTooltip.show(findDOMNode(tooltipRef.current))
    } else {
      ReactTooltip.hide(findDOMNode(tooltipRef.current))
    }
  })

  const tooltipElement = <span data-tip={text} data-for={id} ref={tooltipRef} />

  return (
    <>
      {children({
        showTooltip: () => {
          setShow(true)
        },
        hideTooltip: () => {
          setShow(false)
        },
        tooltipElement: tooltipElement
      })}
      <DefaultTooltip
        data-testid="tooltip"
        id={id}
        event="dbclick"
        place={position || 'top'}
        effect="solid"
        type="light"
        html={true}
      />
    </>
  )
}

TooltipContainer.propTypes = {
  children: PropTypes.func.isRequired
}
export default TooltipContainer

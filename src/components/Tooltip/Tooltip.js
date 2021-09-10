import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { v4 } from 'uuid'
import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled/macro'
import { useState, useEffect } from 'react'

const DefaultTooltip = styled(ReactTooltip)`
  box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
  opacity: 1 !important;
  max-width: 400px;
`

const warningHtml = ({
  text
}) => `<div style="position: relative"><svg style="position: absolute; left: -5px; top: 0;" width="19" height="17">
<path
  d="M8.746 5.03c.47-.115.96.114 1.156.554.059.153.098.307.098.479-.02.478-.059.976-.098 1.454-.04.746-.098 1.512-.137 2.258-.02.249-.02.268-.02.517A.732.732 0 0 1 9 11c-.411 0-.725-.287-.744-.689-.06-1.167-.137-2.143-.196-3.31L8 6.062c-.019-.479.275-.9.746-1.034M9.01 14A1.01 1.01 0 0 1 8 13c0-.549.455-1 1.01-1 .554 0 1.01.451.99 1.02.02.529-.456.98-.99.98m-6.161 3h13.293c2.188 0 3.563-2.361 2.48-4.209L11.954 1.417c-1.083-1.89-3.834-1.89-4.917 0L.369 12.79C-.693 14.66.661 17 2.85 17"
  fill="#DC2E2E"
  fillRule="evenodd"
/>
</svg><p style="margin-left: 20px" >${text}</p></div>`

const TooltipContainer = props => {
  const { text, position, children, offset, warning } = props
  const id = v4()
  const [show, setShow] = useState(false)
  const tooltipRef = React.createRef()

  useEffect(() => {
    if (show) {
      ReactTooltip.show(findDOMNode(tooltipRef.current))
    } else {
      ReactTooltip.hide(findDOMNode(tooltipRef.current))
    }
  })

  const tooltipElement = (
    <span
      data-html={true}
      data-tip={warning ? warningHtml({ text }) : text}
      data-for={id}
      ref={tooltipRef}
    />
  )

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
        offset={offset}
      />
    </>
  )
}

TooltipContainer.propTypes = {
  children: PropTypes.func.isRequired
}
export default TooltipContainer

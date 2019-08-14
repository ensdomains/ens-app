import React from 'react'
import createIcon from '../utils/blockies'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const BlockiesContainer = styled('span')``

const Blockies = ({
  address,
  imageSize = 42,
  color,
  bgcolor,
  spotcolor,
  className
}) => {
  console.log({ address, imageSize, color, bgcolor, spotcolor, className })
  var imgURL = createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5,
    color,
    bgcolor,
    spotcolor
  }).toDataURL()
  var style = {
    backgroundImage: 'url(' + imgURL + ')',
    backgroundSize: 'cover',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block'
  }

  return <BlockiesContainer className={className} style={style} />
}

Blockies.propTypes = {
  address: PropTypes.string.isRequired,
  imageSize: PropTypes.number,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  spotcolor: PropTypes.string,
  className: PropTypes.string
}

export default Blockies

import React from 'react'
import createIcon from '../utils/blockies'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const BlockiesContainer = styled('span')``

const Blockies = ({ address, imageSize = 42, className }) => {
  var imgURL = createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5
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
  className: PropTypes.string
}

export default Blockies

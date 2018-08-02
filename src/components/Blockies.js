import React from 'react'
import createIcon from '../lib/blockies'
import PropTypes from 'prop-types'

const Blockies = ({ address, imageSize = 42, className }) => {
  var imgURL = createIcon({
    seed: address,
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

  return <span className={'ethereum-address-icon ' + className} style={style} />
}

Blockies.propTypes = {
  address: PropTypes.string.isRequired,
  imageSize: PropTypes.number,
  className: PropTypes.string
}

export default Blockies

import React from 'react'

const EPNSLink = ({ children, onClick = null }) => {
  async function handleClick(e) {
    e.preventDefault()

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <>
      <a href="#" onClick={handleClick}>
        {children}
      </a>
    </>
  )
}

export default EPNSLink

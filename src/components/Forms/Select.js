import React, { Component } from 'react'
import styled from 'react-emotion'
import Select from 'react-select'
import chroma from 'chroma-js'

const SelectContainer = styled('div')`
  width: 250px;
`

const styles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    console.log(data)
    // const color = chroma(data.color)

    return {
      ...styles,
      // backgroundColor: isDisabled
      //   ? null
      //   : isSelected
      //     ? data.color
      //     : isFocused
      //       ? color.alpha(0.1).css()
      //       : null,
      // color: isDisabled
      //   ? '#ccc'
      //   : isSelected
      //     ? chroma.contrast(color, 'white') > 2
      //       ? 'white'
      //       : 'black'
      //     : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default'
    }
  },
  input: styles => ({ ...styles }),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles })
}

class SelectComponent extends Component {
  render() {
    const { selectedOption, handleChange, className } = this.props

    return (
      <SelectContainer className={className}>
        <Select
          value={selectedOption}
          onChange={handleChange}
          {...this.props}
          styles={styles}
          theme={theme => ({
            ...theme,
            borderRadius: 10,
            colors: {
              ...theme.colors,
              text: 'orangered',
              primary25: 'hotpink',
              primary: 'black'
            }
          })}
        />
      </SelectContainer>
    )
  }
}

export default SelectComponent

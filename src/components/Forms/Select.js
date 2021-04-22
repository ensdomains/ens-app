import React, { Component } from 'react'
import styled from '@emotion/styled/macro'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

const SelectContainer = styled('div')`
  width: 250px;
`

const styles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    textTransform: 'lowercase',
    fontWeight: '700',
    fontSize: '12px',
    color: '#2B2B2B',
    letterSpacing: '0.5px'
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled
      //   ? null
      //   : isSelected
      //     ? data.color
      //     : isFocused
      //       ? color.alpha(0.1).css()
      //       : null,
      backgroundColor: 'white',
      textTransform: 'lowercase',
      fontWeight: isSelected ? 700 : 500,
      fontSize: '12px',
      letterSpacing: '0.5px',
      color: isDisabled ? '#ccc' : isSelected ? 'black' : '#666',
      cursor: isDisabled ? 'not-allowed' : 'default'
    }
  },
  input: styles => ({ ...styles }),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles })
}

class SelectComponent extends Component {
  render() {
    const { selectedOption, handleChange, className, addNewKey } = this.props
    const SelectorType = addNewKey ? CreatableSelect : Select
    return (
      <SelectContainer className={className}>
        <SelectorType
          isHidden={false}
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
              primary25: 'blue',
              primary: '#cccccc'
            }
          })}
        />
      </SelectContainer>
    )
  }
}

export default SelectComponent

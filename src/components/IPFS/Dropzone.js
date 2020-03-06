import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { ReactComponent as UploadIcon } from '../Icons/Upload.svg'

const DropzoneArea = styled('div')`
  height: 200px;
  width: 200px;
  background-color: #fff;
  border: 2px dashed rgb(187, 186, 186);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
`

const Icon = styled(UploadIcon)`
  opacity: 0.3;
  height: 64px;
  width: 64px;
`

const IconText = styled('span')`
  opacity: 0.3;
`

const Dropzone = props => {
  const [highlight, setHighlight] = useState(false)
  const fileInputRef = React.createRef()

  const openFileDialog = useCallback(() => {
    if (props.disabled) return
    fileInputRef.current.click()
  })

  const onFilesAdded = useCallback(evt => {
    if (props.disabled) return
    const files = evt.target.files
    if (props.onFilesAdded) {
      if (files.length > 1) {
        const array = directoryListToArray(files)
        props.onFilesAdded(array)
      } else {
        const array = fileListToArray(files)
        props.onFilesAdded(array)
      }
    }
  })

  const onDragOver = useCallback(event => {
    event.preventDefault()
    if (props.disabed) return
    setHighlight(true)
  })

  const onDragLeave = useCallback(event => {
    setHighlight(false)
  })

  const onDrop = useCallback(event => {
    event.preventDefault()
    if (props.disabed) return
    const files = event.dataTransfer.files
    if (props.onFilesAdded) {
      const array = fileListToArray(files)
      props.onFilesAdded(array)
    }
    setHighlight(false)
  })

  const fileListToArray = list => {
    const array = []
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  const directoryListToArray = list => {
    const array = []
    for (var i = 0; i < list.length; i++) {
      const item = {
        path: `${list.item(i).webkitRelativePath}`,
        content: list.item(i)
      }
      array.push(item)
    }
    return array
  }

  return (
    <DropzoneArea
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: props.disabled ? 'default' : 'pointer' }}
    >
      <input
        type="file"
        webkitdirectory="webkitdirectory"
        multiple="multiple"
        ref={fileInputRef}
        style={{ display: `none` }}
        onChange={onFilesAdded}
      />
      <Icon />
      <IconText>Click To Upload Directories or Drag A File</IconText>
    </DropzoneArea>
  )
}

export default Dropzone

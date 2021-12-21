import React from 'react'
import styled from '@emotion/styled/macro'
import Button from '../Forms/Button'
import mq from 'mediaQuery'

const FileUpload = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
  margin-bottom 10px;
`

const UploadButton = styled(Button)`
  flex-direction: row;
  margin-bottom: 5px;
  width: 100%;
  background: #282929;
  ${mq.small`
    margin-left: 20px;
    max-width: 175px;
  `}
`

const Dropzone = props => {
  const fileInputRef = React.createRef()
  const folderInputRef = React.createRef()

  const openFileDialog = () => {
    if (props.disabled) return
    fileInputRef.current.click()
  }

  const openFolderDialog = () => {
    if (props.disabled) return
    folderInputRef.current.click()
  }

  const onFilesAdded = e => {
    if (props.disabled) return
    const files = e.target.files
    if (props.sendRequest) {
      if (files.length > 1) {
        const array = directoryListToArray(files)
        props.sendRequest(array)
      } else {
        const array = fileListToArray(files)
        props.sendRequest(array)
      }
    }
  }

  const fileListToArray = list => {
    const array = []
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  const directoryListToArray = list => {
    const array = []
    for (let i = 0; i < list.length; i++) {
      const item = {
        path: `${list.item(i).webkitRelativePath}`,
        content: list.item(i)
      }
      array.push(item)
    }
    return array
  }

  return (
    <>
      <FileUpload
        onClick={openFolderDialog}
        style={{ cursor: props.disabled ? 'default' : 'pointer' }}
      >
        <UploadButton>Folder Upload</UploadButton>
        <input
          type="file"
          webkitdirectory="webkitdirectory"
          multiple="multiple"
          ref={folderInputRef}
          style={{ display: 'none' }}
          onChange={onFilesAdded}
        />
      </FileUpload>
      <FileUpload
        onClick={openFileDialog}
        style={{ cursor: props.disabled ? 'default' : 'pointer' }}
      >
        <UploadButton>File Upload</UploadButton>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFilesAdded}
        />
      </FileUpload>
    </>
  )
}

export default Dropzone

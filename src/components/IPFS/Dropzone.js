import React from 'react'
import styled from '@emotion/styled'

const FileUpload = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
  margin-bottom 10px;
`

const UploadButton = styled('button')`
  color: rgb(187, 186, 186);
  border: solid;
  background-color: white;
  padding: 8px 20px;
  font-size: 20px;
  font-weight: bold;
  :hover {
    background: #2c46a6;
    color: white;
  }
  :focus {
    border-color: #2c46a6;
  }
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
          style={{ display: `none` }}
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
          style={{ display: `none` }}
          onChange={onFilesAdded}
        />
      </FileUpload>
    </>
  )
}

export default Dropzone

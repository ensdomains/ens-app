import React, { Component } from 'react'
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

class Dropzone extends Component {
  constructor(props) {
    super(props)
    this.state = { hightlight: false }
    this.fileInputRef = React.createRef()

    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  openFileDialog() {
    if (this.props.disabled) return
    this.fileInputRef.current.click()
  }

  onFilesAdded(evt) {
    if (this.props.disabled) return
    const files = evt.target.files
    if (this.props.onFilesAdded) {
      if (files.length > 1) {
        const array = this.directoryListToArray(files)
        this.props.onFilesAdded(array)
      } else {
        const array = this.fileListToArray(files)
        this.props.onFilesAdded(array)
      }
    }
  }

  onDragOver(event) {
    event.preventDefault()
    if (this.props.disabed) return
    this.setState({ hightlight: true })
  }

  onDragLeave(event) {
    this.setState({ hightlight: false })
  }

  onDrop(event) {
    event.preventDefault()
    if (this.props.disabed) return
    const files = event.dataTransfer.files
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
    this.setState({ hightlight: false })
  }

  fileListToArray(list) {
    const array = []
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  directoryListToArray(list) {
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

  render() {
    return (
      <DropzoneArea
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
      >
        <input
          type="file"
          webkitdirectory="webkitdirectory"
          multiple="multiple"
          ref={this.fileInputRef}
          style={{ display: `none` }}
          onChange={this.onFilesAdded}
        />
        <Icon />
        <IconText>Click Or Drag To Upload</IconText>
      </DropzoneArea>
    )
  }
}

export default Dropzone

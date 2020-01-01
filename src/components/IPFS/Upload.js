import React, { Component } from 'react'
import Dropzone from './Dropzone'
import styled from '@emotion/styled'
import Loading from './Loading'
import ipfsClient from 'ipfs-http-client'
import { loggedIn, getToken } from './Auth'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
  text-align: left;
  overflow: hidden;
`

const FileName = styled('span')`
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
`

const Content = styled('div')`
  display: flex;
  flex-direction: row;
  padding-top: 16px;
  box-sizing: border-box;
  width: 100%;
  padding: 0% 10%;
`

const Files = styled('div')`
  margin-left: 32px;
  align-items: flex-start;
  justify-items: flex-start;
  flex: 1;
  overflow-y: auto;
`

const Row = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  height: 50px;
  padding: 8px;
  overflow: hidden;
  box-sizing: border-box;
`

const Checkmark = styled('img')`
  opacity: 0.5;
  margin-left: 32px;
`

const LoadingWrapper = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      uploading: false,
      loading: {},
      successfullUploaded: false,
      uploadError: false,
      newHash: null
    }

    this.ipfs = ipfsClient({
      host: 'dev.api.ipfs.temporal.cloud',
      port: '443',
      'api-path': '/api/v0/',
      protocol: 'https',
      headers: {
        Authorization: loggedIn() ? 'Bearer ' + getToken() : ''
      }
    })

    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.sendRequest = this.sendRequest.bind(this)
    this.renderProgress = this.renderProgress.bind(this)
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }))
    this.setState({ uploading: true })
    this.sendRequest(files)
  }

  sendRequest(files) {
    const file = [...files][0]
    let ipfsId
    const copy = { ...this.state.loading }
    this.setState({ loading: copy })

    if (files.length > 1) {
      copy[file.path] = { state: 'pending', percentage: 0 }
      this.setState({ loading: copy })
      this.ipfs
        .add(files, {})
        .then(response => {
          console.log(response)
          const root = response[response.length - 1]
          console.log(root.hash)
          if (this.props.updateValue) {
            this.props.updateValue('ipfs://' + root.hash)
          }
          this.setState({ uploading: false, successfullUploaded: true })
        })
        .catch(err => {
          copy[file.path] = { state: 'error', percentage: 0 }
          this.setState({ loading: copy })
          console.log('error')
          console.error(err)
          this.setState({ uploading: true, uploadError: true })
        })
    } else {
      console.log('starting')
      copy[file.name] = { state: 'pending', percentage: 0 }
      this.setState({ loading: copy })
      this.ipfs
        .add(file, {})
        .then(response => {
          console.log(response)
          ipfsId = response[0].hash
          console.log(ipfsId)
          if (this.props.updateValue) {
            this.props.updateValue('ipfs://' + ipfsId)
          }
          this.setState({ uploading: false, successfullUploaded: true })
        })
        .catch(err => {
          copy[file.name] = { state: 'error', percentage: 0 }
          this.setState({ loading: copy })
          console.log('error')
          console.error(err)
          this.setState({ uploading: true, uploadError: true })
        })
    }
  }

  renderProgress(file) {
    const loading = this.state.loading[file.name]
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <LoadingWrapper>
          <Loading loaded={loading ? loading.percentage : 0} />
          <Checkmark
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity: loading && loading.state === 'done' ? 0.5 : 0
            }}
          />
        </LoadingWrapper>
      )
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Dropzone
            onFilesAdded={this.onFilesAdded}
            disabled={this.state.uploading || this.state.successfullUploaded}
          />
          <Files>
            {this.state.files.length > 1
              ? this.state.files.map(file => {
                  return (
                    <Row key={file.path}>
                      <FileName>{file.path}</FileName>
                      {this.renderProgress(file)}
                    </Row>
                  )
                })
              : this.state.files.map(file => {
                  return (
                    <Row key={file.name}>
                      <FileName>{file.name}</FileName>
                      {this.renderProgress(file)}
                    </Row>
                  )
                })}
          </Files>
        </Content>
      </Container>
    )
  }
}

export default Upload

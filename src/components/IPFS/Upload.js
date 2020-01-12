import React, { Component } from 'react'
import Dropzone from './Dropzone'
import styled from '@emotion/styled'
import Loading from './Loading'
import ipfsClient from 'ipfs-http-client'
import { loggedIn, getToken } from './Auth'
import { getConfig } from './Config'
import Loader from '../Loader'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  text-align: left;
  overflow: hidden;
`

const FileName = styled('span')`
  margin-bottom: 12px;
  font-size: 26px;
`

const Files = styled('div')`
  align-items: flex-start;
  justify-items: flex-start;
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
    const client = getConfig('Temporal')
    console.log(client)
    const ipfs = ipfsClient({
      host: client.dev,
      port: client.port,
      'api-path': client.apiPath,
      protocol: client.protocol,
      headers: {
        Authorization: loggedIn() ? 'Bearer ' + getToken() : ''
      }
    })
    const file = [...files][0]
    let ipfsId
    const copy = { ...this.state.loading }
    this.setState({ loading: copy })

    if (files.length > 1) {
      var x
      for (x in files) {
        copy[files[x].path] = { state: 'pending', percentage: 0 }
        this.setState({ loading: copy })
      }
      ipfs
        .add(files, { progress: prog => console.log(`received: ${prog}`) })
        .then(response => {
          console.log(response)
          const root = response[response.length - 1]
          console.log(root.hash)
          if (this.props.updateValue) {
            this.props.updateValue('ipfs://' + root.hash)
          }
          this.setState({
            uploading: false,
            successfullUploaded: true,
            newHash: `ipfs://` + root.hash
          })
        })
        .catch(err => {
          copy[file.path] = { state: 'error', percentage: 0 }
          this.setState({ loading: copy })
          console.log('error')
          console.error(err)
          this.setState({ uploading: false, uploadError: true })
        })
    } else {
      console.log('starting')
      copy[file.name] = { state: 'pending', percentage: 0 }
      this.setState({ loading: copy })
      ipfs
        .add(file, {})
        .then(response => {
          console.log(response)
          ipfsId = response[0].hash
          console.log(ipfsId)
          if (this.props.updateValue) {
            this.props.updateValue('ipfs://' + ipfsId)
          }
          this.setState({
            uploading: false,
            successfullUploaded: true,
            newHash: `ipfs://` + ipfsId
          })
        })
        .catch(err => {
          copy[file.name] = { state: 'error', percentage: 0 }
          this.setState({ loading: copy })
          console.log('error')
          console.error(err)
          this.setState({ uploading: false, uploadError: true })
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
        {this.state.uploading ? (
          <Loader withWrap large />
        ) : this.state.successfullUploaded ? (
          <>
            <Files>
              {this.state.files.length > 1 ? (
                <FileName>Directory Successfully Uploaded!</FileName>
              ) : (
                <FileName>File Successfully Uploaded!</FileName>
              )}
            </Files>
          </>
        ) : (
          <Dropzone
            onFilesAdded={this.onFilesAdded}
            disabled={this.state.uploading || this.state.successfullUploaded}
          />
        )}
      </Container>
    )
  }
}

export default Upload

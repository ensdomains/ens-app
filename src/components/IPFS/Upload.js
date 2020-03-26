import React, { useState } from 'react'
import Dropzone from './Dropzone'
import styled from '@emotion/styled'
import ipfsClient from 'ipfs-http-client'
import { loggedIn, getToken } from './Auth'
import { getConfig, getDev } from './Config'
import Loader from '../Loader'
import mq from 'mediaQuery'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  text-align: left;
  overflow: hidden;
`

const FileName = styled('span')`
  margin-bottom: 0px;
  font-size: 16px;
  ${mq.small`
    font-size: 24px;
    margin-bottom: 12px;
  `}
`

const ErrorMsg = styled('span')`
  margin-bottom: 0px;
  font-size: 16px;
  color: red;
  ${mq.small`
    font-size: 18px;
    margin-bottom: 8px;
  `}
`

const Files = styled('div')`
  align-items: flex-start;
  justify-items: flex-start;
`

const Upload = props => {
  const [files, setFiles] = useState([])
  const [upload, setUpload] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)

  const sendRequest = newfiles => {
    const client = getConfig('TEMPORAL')
    const ipfs = ipfsClient({
      host: getDev() ? client.dev : client.host,
      port: client.port,
      'api-path': client.apiPath,
      protocol: client.protocol,
      headers: {
        Authorization: loggedIn() ? 'Bearer ' + getToken() : ''
      }
    })
    setFiles(newfiles)
    setUpload(true)
    if (newfiles.length > 1) {
      ipfs
        .add(newfiles, {})
        .then(response => {
          const root = response[response.length - 1]
          if (props.updateValue) {
            props.updateValue('ipfs://' + root.hash)
          }
          setUpload(false)
          setSuccess(true)
        })
        .catch(err => {
          setUpload(false)
          setUploadError(true)
        })
    } else if (newfiles.length === 1) {
      const file = [...newfiles][0]
      let ipfsId
      ipfs
        .add(file, {})
        .then(response => {
          ipfsId = response[0].hash
          if (props.updateValue) {
            props.updateValue('ipfs://' + ipfsId)
          }
          setUpload(false)
          setSuccess(true)
        })
        .catch(err => {
          setUpload(false)
          setUploadError(true)
        })
    }
  }

  return (
    <Container>
      {upload ? (
        <Loader withWrap large />
      ) : success ? (
        <>
          <Files>
            {files.length > 1 ? (
              <FileName>Folder Successfully Uploaded!</FileName>
            ) : (
              <FileName>File Successfully Uploaded!</FileName>
            )}
          </Files>
        </>
      ) : (
        <>
          <ErrorMsg>
            {uploadError ? 'There was a problem uploading your file' : ''}
          </ErrorMsg>
          <Dropzone sendRequest={sendRequest} disabled={upload || success} />
        </>
      )}
    </Container>
  )
}

export default Upload

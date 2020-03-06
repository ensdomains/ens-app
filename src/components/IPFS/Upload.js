import React, { useState } from 'react'
import Dropzone from './Dropzone'
import styled from '@emotion/styled'
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

const Upload = props => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState({})
  const [uploadError, setUploadError] = useState(false)
  const [newHash, setNewHash] = useState(null)

  const onFilesAdded = newfiles => {
    setFiles(files.concat(newfiles))
    setUploading(true)
    sendRequest(newfiles)
  }

  const sendRequest = newfiles => {
    const client = getConfig('TEMPORAL')
    const ipfs = ipfsClient({
      host: client.dev,
      port: client.port,
      'api-path': client.apiPath,
      protocol: client.protocol,
      headers: {
        Authorization: loggedIn() ? 'Bearer ' + getToken() : ''
      }
    })
    const file = [...newfiles][0]
    let ipfsId
    const copy = { ...loading }
    setLoading(copy)

    if (newfiles.length > 1) {
      var x
      for (x in files) {
        copy[newfiles[x].path] = { state: 'pending', percentage: 0 }
        setLoading(copy)
      }
      ipfs
        .add(files, {})
        .then(response => {
          const root = response[response.length - 1]
          if (props.updateValue) {
            props.updateValue('ipfs://' + root.hash)
          }
          setUploading(false)
          setSuccess(true)
          setNewHash(`ipfs://` + root.hash)
        })
        .catch(err => {
          copy[file.path] = { state: 'error', percentage: 0 }
          setLoading(copy)
          setUploading(false)
          setUploadError(true)
        })
    } else {
      copy[file.name] = { state: 'pending', percentage: 0 }
      setLoading(copy)
      ipfs
        .add(file, {})
        .then(response => {
          ipfsId = response[0].hash
          if (props.updateValue) {
            props.updateValue('ipfs://' + ipfsId)
          }
          setUploading(false)
          setSuccess(true)
          setNewHash(`ipfs://` + ipfsId)
        })
        .catch(err => {
          copy[file.name] = { state: 'error', percentage: 0 }
          setLoading(copy)
          setUploading(false)
          setUploadError(true)
        })
    }
  }

  return (
    <Container>
      {uploading ? (
        <Loader withWrap large />
      ) : success ? (
        <>
          <Files>
            {files.length > 1 ? (
              <FileName>Directory Successfully Uploaded!</FileName>
            ) : (
              <FileName>File Successfully Uploaded!</FileName>
            )}
          </Files>
        </>
      ) : (
        <Dropzone
          onFilesAdded={onFilesAdded()}
          disabled={uploading || success}
        />
      )}
    </Container>
  )
}

export default Upload

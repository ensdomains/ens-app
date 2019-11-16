import React from 'react'
import { Title } from '../Typography/Basic'
var ipfsClient = require('ipfs-http-client')

// Uploader is a generalized ipfs upload capable of uploading
// and interacting with an IPFS HTTP API
class Uploader {
  // initializes the ipfs uploader class
  constructor(userOpts) {
    this.ipfsapi = ipfsClient({
      // the hostname (or ip address) of the endpoint providing the ipfs api
      host: userOpts.host,
      // the port to connect on
      port: userOpts.port,
      'api-path': userOpts.apiPath,
      // the protocol, https for security
      protocol: userOpts.protocol,
      headers: userOpts.headers
      // provide the jwt within an authorization header
    })
  }

  // pins a given hash
  pinHash(hash) {
    this.ipfsapi.pin.add(hash, function(err, response) {
      if (err) {
        console.error(err, err.stack)
      } else {
        console.log(response)
      }
    })
  }

  // TODO(postables): add a call to upload files
}

function IPFSUploader(userOpts) {
  const upl = new Uploader(userOpts)
  return <Title>Hello World</Title>
}

export default IPFSUploader

/* How to use:

const jwt = process.env.TEMPORAL_JWT;
const upl = new Uploader({
    // the hostname (or ip address) of the endpoint providing the ipfs api
    host: 'api.ipfs.temporal.cloud',
    // the port to connect on
    port: '443',
    apiPath: '/api/v0/',
    // the protocol, https for security
    protocol: 'https',
    // provide the jwt within an authorization header
    headers: {
        authorization: 'Bearer ' + jwt,
    }
});

upl.pinHash('QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv')
*/

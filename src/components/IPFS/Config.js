const TEMPORAL = {
  host: 'api.ipfs.temporal.cloud', // the IPFS api endpoint used when the etherium profile is set to mainnet
  dev: 'dev.api.ipfs.temporal.cloud', // the IPFS api endpoint used when not on mainnet
  port: '443', // the port the endpoint is served from
  apiPath: '/api/v0/', // Api path extension if nessecary
  protocol: 'https', // the protocol used to comunicate with the endpoint
  auth: true, // If the api requires authention headers
  login: 'https://api.temporal.cloud/v2/auth/login', // the Authentication endpoint to verify users information. Currently supports JWT
  loginDev: 'https://dev.api.temporal.cloud/v2/auth/login' // same as login but used if user is not on mainnet
}

export function getConfig(service) {
  switch (service) {
    case (service = 'TEMPORAL'):
      return TEMPORAL
    default:
      return TEMPORAL
  }
}

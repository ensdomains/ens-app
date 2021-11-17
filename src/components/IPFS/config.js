import temporallogo from '../../assets/temporal.png'

const TEMPORAL = {
  name: 'Temporal', // Name of the IPFS service
  logo: temporallogo, // Logo used for the login/sign up header
  link: 'https://play2.temporal.cloud', // The link when people click on the logo or manage domains notice
  host: 'api.ipfs.temporal.cloud', // the IPFS api endpoint used when the etherium profile is set to mainnet
  dev: 'api.ipfs.temporal.cloud', // the IPFS api endpoint used when not on mainnet
  port: '443', // the port the endpoint is served from
  apiPath: '/api/v0/', // Api path extension if necessary
  protocol: 'https', // the protocol used to comunicate with the endpoint
  auth: true, // If the api requires authention headers
  login: 'https://api.temporal.cloud/v2/auth/login', // the Authentication endpoint to verify users information. Currently supports JWT
  loginDev: 'https://dev.api.temporal.cloud/v2/auth/login', // same as login but used if user is not on mainnet
  signup: 'https://api.temporal.cloud/v2/auth/register',
  signupDev: 'https://dev.api.temporal.cloud/v2/auth/register'
}

export function getConfig(service) {
  switch (service) {
    case 'TEMPORAL':
      return TEMPORAL
    default:
      return TEMPORAL
  }
}

export function getDev() {
  if (window.location.href.includes('https://app.ens.domains')) {
    return false
  } else {
    return true
  }
}

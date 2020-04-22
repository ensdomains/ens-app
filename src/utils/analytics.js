import ReactGA from 'react-ga'
import { getNetworkId } from '@ensdomains/ui'
const TrackingID = 'UA-138903307-1'

function isProduction() {
  return window.location.host === 'app.ens.domains'
}

async function isMainnet() {
  const id = await getNetworkId()
  return id === 1
}

export const setup = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID)
  }
}

export const pageview = () => {
  const page = window.location.pathname + window.location.search
  if (isProduction()) {
    ReactGA.pageview(page)
  }
}

export const triggerReferral = async ({
  labels,
  transactionId,
  type,
  source
}) => {
  const mainnet = await isMainnet()
  if (isProduction() && mainnet) {
    ReactGA.event({ labels, transactionId, type, source })
  } else {
    console.log(
      'Referral triggered on testnet/local',
      JSON.stringify({
        labels,
        transactionId,
        type,
        source
      })
    )
  }
}

export default {
  setup,
  pageview
}

import ReactGA from 'react-ga'
import { getNetworkId } from '@ensdomains/ui'
import EthVal from 'ethval'

const TrackingID = {
  live: 'UA-138903307-1',
  dev: 'UA-138903307-2'
}

function isProduction() {
  return window.location.host === 'app.ens.domains'
}

function isDev() {
  return window.location.host === 'ensappdev.surge.sh'
}

async function isMainnet() {
  const id = await getNetworkId()
  return id === 1
}

export const setup = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID.live)
    ReactGA.plugin.require('ecommerce')
  } else if (isDev()) {
    ReactGA.initialize(TrackingID.dev)
    ReactGA.plugin.require('ecommerce')
  }
}

export const pageview = () => {
  const page = window.location.pathname + window.location.search
  if (isProduction()) {
    ReactGA.pageview(page)
  }
}

export const trackReferral = async ({
  labels, // labels array
  transactionId, //hash
  type, // renew/register
  price, // in wei
  referrer //
}) => {
  const mainnet = await isMainnet()
  const priceInEth = new EthVal(`${price}`).toEth()

  if (isProduction() && mainnet) {
    ReactGA.event({ labels, transactionId, type, referrer })
    labels.forEach(label => {
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: transactionId,
        name: label,
        sku: label,
        category: type
      })
    })
    ReactGA.plugin.execute('ecommerce', 'addTransaction', {
      id: transactionId, // Transaction ID. Required.
      affiliation: referrer, // Affiliation or store name.
      revenue: priceInEth.toFixed(6) // Grand Total.
    })
    ReactGA.plugin.execute('ecommerce', 'send')
    ReactGA.plugin.execute('ecommerce', 'clear')
  } else {
    console.log(
      'Referral triggered on testnet/local',
      JSON.stringify({
        labels,
        transactionId,
        type,
        referrer
      })
    )
  }
}

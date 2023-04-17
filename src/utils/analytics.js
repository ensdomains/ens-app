import ReactGA from 'react-ga'
import ReactGA4 from 'react-ga4'
import { getNetworkId } from '@ensdomains/ui'

const TrackingID = {
  live: 'UA-138903307-1',
  dev: 'UA-138903307-2'
}

const V4TrackingID = 'G-0R0K339MK5'

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

export function setUtm() {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) {
    window.sessionStorage.setItem('utmSource', utmSource)
  }
}

export function getUtm() {
  return window.sessionStorage.getItem('utmSource')
}

export const setupAnalytics = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID.live)
    ReactGA.plugin.require('ecommerce')
    ReactGA4.initialize(V4TrackingID)
  } else {
    ReactGA.initialize(TrackingID.dev)
    ReactGA.plugin.require('ecommerce', { debug: true })
    console.log('Analytics setup for dev with ', TrackingID.dev)
  }

  setUtm()
}

export const pageview = () => {
  const page = window.location.pathname + window.location.search
  if (isProduction() || isDev()) {
    ReactGA.pageview(page)
    ReactGA4.send({ hitType: 'pageview', page })
  }
}

export const trackReferral = async ({
  labels, // labels array
  transactionId, //hash
  type, // renew/register
  price, // in wei,
  premium = 0,
  years
}) => {
  const mainnet = await isMainnet()
  const referrer = getUtm()
  const unitPrice = (price - premium) / years / labels.length

  function track() {
    const eventObject = {
      category: 'referral',
      action: `${type} domain`,
      labels,
      transactionId,
      type,
      referrer
    }
    ReactGA.event(eventObject)
    ReactGA4.send(eventObject)
    ReactGA.plugin.execute('ecommerce', 'addTransaction', {
      id: transactionId, // Transaction ID. Required.
      affiliation: referrer, // Affiliation or store name.
      revenue: price // Grand Total.
    })
    const camelised = type.charAt(0).toUpperCase() + type.slice(1)
    labels.forEach(label => {
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: transactionId,
        name: label,
        sku: label,
        category: type,
        price: unitPrice,
        quantity: years
      })
      if (window.plausible) {
        window.plausible(camelised, {
          props: {
            id: transactionId,
            name: label,
            price: unitPrice,
            referrer,
            quantity: years
          }
        })
      }
      if (premium > 0) {
        ReactGA.plugin.execute('ecommerce', 'addItem', {
          id: transactionId,
          name: label,
          sku: label,
          category: type,
          price: premium,
          quantity: 1
        })
        if (window.plausible) {
          plausible(camelised, {
            props: {
              id: transactionId,
              name: label,
              price: premium,
              referrer,
              quantity: 1
            }
          })
        }
      }
    })
    ReactGA.plugin.execute('ecommerce', 'send')
    ReactGA.plugin.execute('ecommerce', 'clear')
  }

  if (isProduction() && mainnet) {
    console.log('calling tracking from live')
    track()
    console.log('Completed tracking from live')
  } else if (isDev()) {
    console.log('calling tracking from dev')
    track()
    console.log('Completed tracking from dev')
  } else {
    console.log(
      'Referral triggered on local development',
      JSON.stringify({
        labels,
        transactionId,
        type,
        price,
        unitPrice,
        premium,
        years,
        referrer
      })
    )
  }
}

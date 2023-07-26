import { getNetworkId } from '@ensdomains/ui'

function isProduction() {
  return window.location.host === 'legacy.ens.domains'
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
  setUtm()
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
    const camelised = type.charAt(0).toUpperCase() + type.slice(1)
    labels.forEach(label => {
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

const EPNS_CONFIG = {
  // MAIN_NET - prod
  1: {
    CHANNEL_ADDRESS: '0x983110309620D911731Ac0932219af06091b6744', // ENS address
    API_BASE_URL: 'https://backend-prod.epns.io/apis',
    EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa'
  }
}

const signingConstants = {
  // The several types of actions and their corresponding types
  //  which we can take, when it comes to signing messages
  ACTION_TYPES: {
    // the type to be used for the subscribe action to a channel
    subscribe: {
      Subscribe: [
        { name: 'channel', type: 'address' },
        { name: 'subscriber', type: 'address' },
        { name: 'action', type: 'string' }
      ]
    },
    // the type to be used for the unsubscribe action to a channel
    unsubscribe: {
      Unsubscribe: [
        { name: 'channel', type: 'address' },
        { name: 'unsubscriber', type: 'address' },
        { name: 'action', type: 'string' }
      ]
    }
  }
}

function getDomainInformation(chainId, verifyingContractAddress) {
  return {
    name: 'EPNS COMM V1',
    chainId: chainId,
    verifyingContract:
      verifyingContractAddress ||
      EPNS_CONFIG[chainId].EPNS_COMMUNICATOR_CONTRACT
  }
}

function getSubscriptionMessage(channelAddress, userAddress, action) {
  return {
    channel: channelAddress,
    [action === 'Unsubscribe' ? 'unsubscriber' : 'subscriber']: userAddress,
    action: action
  }
}

async function fetchPOST(url, body = {}, options = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    ...options,
    body: body
  })
    .then(async response => {
      const isJson = response.headers
        .get('content-type')
        ?.includes('application/json')
      const data = isJson ? await response.json() : null

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status
        return Promise.reject(error)
      }

      return Promise.resolve(data)
    })
    .catch(error => {
      console.error('EPNS API Fetch error: ', error)
      throw error
    })
}

async function optIn(
  signer,
  channelAddress,
  chainId,
  userAddress,
  {
    baseApiUrl = EPNS_CONFIG[chainId].API_BASE_URL,
    verifyingContractAddress = EPNS_CONFIG[chainId].EPNS_COMMUNICATOR_CONTRACT,
    onSuccess = () => 'success',
    onError = () => 'error'
  } = {}
) {
  try {
    // get domain information
    const domainInformation = getDomainInformation(
      chainId,
      verifyingContractAddress
    )
    // get type information
    const typeInformation = signingConstants.ACTION_TYPES['subscribe']
    // get message
    const messageInformation = getSubscriptionMessage(
      channelAddress,
      userAddress,
      'Subscribe'
    )
    // sign message
    const signature = await signer._signTypedData(
      domainInformation,
      typeInformation,
      messageInformation
    )

    const postBody = JSON.stringify({
      signature,
      message: messageInformation,
      op: 'write',
      chainId,
      contractAddress: verifyingContractAddress
    })

    await fetchPOST(`${baseApiUrl}/channels/subscribe_offchain`, postBody)

    onSuccess()
    return { status: 'success', message: 'succesfully opted into channel' }
  } catch (err) {
    onError(err)
    return { status: 'error', message: err.message }
  }
}

async function optOut(
  signer,
  channelAddress,
  chainId,
  userAddress,
  {
    baseApiUrl = EPNS_CONFIG[chainId].API_BASE_URL,
    verifyingContractAddress = EPNS_CONFIG[chainId].EPNS_COMMUNICATOR_CONTRACT,
    onSuccess = () => 'success',
    onError = () => 'error'
  } = {}
) {
  try {
    // get domain information
    const domainInformation = getDomainInformation(
      chainId,
      verifyingContractAddress
    )
    // get type information
    const typeInformation = signingConstants.ACTION_TYPES['unsubscribe']

    // get message
    const messageInformation = getSubscriptionMessage(
      channelAddress,
      userAddress,
      'Unsubscribe'
    )

    // sign message
    const signature = await signer._signTypedData(
      domainInformation,
      typeInformation,
      messageInformation
    )

    const postBody = JSON.stringify({
      signature,
      message: messageInformation,
      op: 'write',
      chainId,
      contractAddress: verifyingContractAddress
    })

    await fetchPOST(`${baseApiUrl}/channels/unsubscribe_offchain`, postBody)

    onSuccess()
    return { status: 'success', message: 'succesfully opted out of channel' }
  } catch (err) {
    onError(err)
    return { status: 'error', message: err.message }
  }
}

function selectConfig(networkId) {
  return EPNS_CONFIG[networkId] || {}
}

/**
 * Function to obtain all the addresses subscribed to a channel
 * @param channelAddress the address of the channel
 * @param userAddress
 */
async function getSubscribers(channelAddress, baseApiUrl) {
  try {
    const postBody = JSON.stringify({ channel: channelAddress, op: 'read' })
    const response = await fetchPOST(
      `${baseApiUrl}/channels/get_subscribers`,
      postBody
    )

    return response.subscribers || []
  } catch (err) {
    throw err
  }
}

async function isUserSubscribed(userAddress, channelAddress, baseApiUrl) {
  const channelSubscribers = await getSubscribers(channelAddress, baseApiUrl)

  return channelSubscribers
    .map(a => a.toLowerCase())
    .includes(userAddress.toLowerCase())
}

const LINKS = [
  {
    text: 'EPNS Browser Extension',
    link:
      'https://chrome.google.com/webstore/detail/epns-protocol-alpha/lbdcbpaldalgiieffakjhiccoeebchmg',
    img: 'https://backend-kovan.epns.io/assets/googlechromeicon.png'
  },
  {
    text: 'EPNS App (iOS)',
    link: 'https://apps.apple.com/app/ethereum-push-service-epns/id1528614910',
    img: 'https://backend-kovan.epns.io/assets/apple.png'
  },
  {
    text: 'EPNS App (Android)',
    link: 'https://play.google.com/store/apps/details?id=io.epns.epns',
    img: 'https://backend-kovan.epns.io/assets/playstorecolor@3x.png'
  },
  {
    text: 'Visit our dApp',
    link: 'https://app.epns.io/',
    img: 'https://backend-kovan.epns.io/assets/dappcolor@3x.png'
  }
]

const CLOSE_ICON = 'https://backend-kovan.epns.io/assets/cross.png'

export { optIn, optOut, selectConfig, isUserSubscribed, LINKS, CLOSE_ICON }

import { useEffect } from 'react'
/** intend to replace this with npm package */
import EmbedSDK from '../utils/embedsdk.esm'

// if only there was a way to pass down chainId to this hook from "Home"!
const CURRENT_SUPPORTED_NETWORK = ['main', 'kovan']
const isSupported = (nw = '') => {
  return CURRENT_SUPPORTED_NETWORK.includes(nw?.toLowerCase())
}

export const useEPNSEmbed = ({
  user,
  targetID,
  appName,
  isReadOnly,
  network
}) => {
  const isEpnsSupportedNetwork = isSupported(network)

  useEffect(() => {
    const shouldTriggerSDK =
      isEpnsSupportedNetwork && user && targetID && appName && !isReadOnly

    if (shouldTriggerSDK && typeof EmbedSDK.init === 'function') {
      EmbedSDK.init({
        targetID: targetID, // MANDATORY
        appName: appName, // MANDATORY
        user: user, // MANDATORY
        headerText: 'EPNS Notifications',
        viewOptions: {
          type: 'sidebar',
          showUnreadIndicator: true,
          unreadIndicatorColor: '#cc1919',
          unreadIndicatorPosition: 'top-right'
        }
      })
    }

    return () => {
      if (shouldTriggerSDK && typeof EmbedSDK.cleanup === 'function') {
        EmbedSDK.cleanup()
      }
    }
  }, [user, targetID, appName, isReadOnly, network])

  return {
    isEpnsSupportedNetwork
  }
}

import { useEffect } from 'react'
/** intend to replace this with npm package */
import EmbedSDK from '../utils/embedsdk.esm'

export const useEPNSEmbed = ({ user, targetID, appName }) => {
  useEffect(() => {
    if (user && targetID && appName) {
      if (typeof EmbedSDK.init === 'function') {
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
    }

    return () => {
      if (typeof EmbedSDK.cleanup === 'function') {
        EmbedSDK.cleanup()
      }
    }
  }, [user, targetID, appName])
}

import { useEffect, useState } from 'react'
import { getSigner, getNetworkId } from '@ensdomains/ui'

export function useWeb3Data() {
  const [signer, setSigner] = useState(null)
  const [networkId, setNetworkId] = useState(null)
  const isEpnsSupportedNetwork = [1, 42].includes(networkId)

  useEffect(() => {
    async function init() {
      const _signer = await getSigner()
      const _networkId = await getNetworkId()

      setSigner(_signer)
      setNetworkId(_networkId)
    }

    init()
  }, [])

  return {
    signer,
    networkId,
    isEpnsSupportedNetwork
  }
}

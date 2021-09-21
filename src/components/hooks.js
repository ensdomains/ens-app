import { useEffect, useReducer, useRef, useState } from 'react'
import { utils } from 'ethers'
import getEtherPrice from 'api/price'
import { useLocation } from 'react-router-dom'
import { loggedIn, logout } from './IPFS/auth'
import { getBlock, getProvider } from '@ensdomains/ui'
import { networkName, supportedAvatarProtocols } from 'utils/utils'
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

export function useScrollTo(pos) {
  useEffect(() => {
    window.scrollTo(0, pos)
  }, [pos])
}

export function useEditable(
  initialState = {
    editing: false,
    newValue: '',
    pending: false,
    confirmed: false,
    txHash: undefined,
    uploading: false,
    authorized: loggedIn()
  }
) {
  const types = {
    UPDATE_VALUE: 'UPDATE_VALUE',
    START_EDITING: 'START_EDITING',
    STOP_EDITING: 'STOP_EDITING',
    START_PENDING: 'START_PENDING',
    RESET_PENDING: 'RESET_PENDING',
    SET_CONFIRMED: 'SET_CONFIRMED',
    START_UPLOADING: 'START_UPLOADING',
    STOP_UPLOADING: 'STOP_UPLOADING',
    START_AUTHORIZING: 'START_AUTHORIZING',
    STOP_AUTHORIZING: 'STOP_AUTHORIZING'
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const startEditing = () => dispatch({ type: types.START_EDITING })
  const stopEditing = () => dispatch({ type: types.STOP_EDITING })
  const updateValue = value => dispatch({ type: types.UPDATE_VALUE, value })
  const startPending = txHash => dispatch({ type: types.START_PENDING, txHash })
  const resetPending = () => dispatch({ type: types.RESET_PENDING })
  const setConfirmed = () => dispatch({ type: types.SET_CONFIRMED })
  const startUploading = () => dispatch({ type: types.START_UPLOADING })
  const stopUploading = () => dispatch({ type: types.STOP_UPLOADING })
  const startAuthorizing = () => dispatch({ type: types.START_AUTHORIZING })
  const stopAuthorizing = () => dispatch({ type: types.STOP_AUTHORIZING })

  const actions = {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    resetPending,
    setConfirmed,
    startUploading,
    stopUploading,
    startAuthorizing,
    stopAuthorizing
  }

  function reducer(state, action) {
    switch (action.type) {
      case types.UPDATE_VALUE:
        return {
          ...state,
          newValue: action.value
        }
      case types.START_EDITING:
        return { ...state, editing: true, confirmed: false, pending: false }
      case types.STOP_EDITING:
        return {
          ...state,
          editing: false,
          confirmed: false,
          pending: false,
          uploading: false
        }
      case types.START_PENDING:
        return {
          ...state,
          pending: true,
          editing: false,
          uploading: false,
          txHash: action.txHash
        }
      case types.RESET_PENDING:
        return {
          ...state,
          pending: false,
          uploading: false,
          editing: false,
          txHash: undefined
        }
      case types.SET_CONFIRMED:
        return { ...state, pending: false, confirmed: true }
      case types.START_UPLOADING:
        return {
          ...state,
          uploading: true,
          confirmed: false,
          pending: false,
          newValue: ''
        }
      case types.STOP_UPLOADING:
        return {
          ...state,
          uploading: false,
          confirmed: false,
          pending: false,
          newValue: ''
        }
      case types.START_AUTHORIZING:
        return {
          ...state,
          authorized: true
        }
      case types.STOP_AUTHORIZING:
        logout()
        return {
          ...state,
          authorized: false
        }
      default:
        return state
    }
  }

  return {
    state,
    actions
  }
}

export function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export function useEthPrice(enabled = true) {
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(undefined)

  useEffect(() => {
    if (enabled) {
      getEtherPrice()
        .then(res => {
          setPrice(res)
          setLoading(false)
        })
        .catch(() => '') // ignore error
    }
  }, [enabled])

  return {
    loading,
    price
  }
}

export function useGasPrice(enabled = true) {
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState({})

  useEffect(() => {
    try {
      const run = async () => {
        const provider = await getProvider()
        const blockDetails = await provider.getBlock('latest')
        if (blockDetails.baseFeePerGas) {
          const baseFeeWei = utils.formatUnits(
            blockDetails.baseFeePerGas,
            'wei'
          )
          const price = {
            slow: baseFeeWei + 2 * Math.pow(10, 9),
            fast: baseFeeWei * 1.5 + 2 * Math.pow(10, 9)
          }
          setPrice(price)
          setLoading(false)
        } else {
          const gasApi = 'https://www.gasnow.org/api/v3/gas/price'
          const result = await fetch(gasApi)
          if (!result.ok)
            throw `Failed to get gas estimate: ${result.statusText}`
          const data = await result.json()
          setPrice(data?.data)
          setLoading(false)
        }
      }
      run()
    } catch (e) {
      console.error('useGasPrice error: ', e)
    }
  }, [enabled])

  return {
    loading,
    price
  }
}

export function useAvatar(textKey, name, network, uri) {
  const [avatar, setAvatar] = useState({})
  useEffect(() => {
    try {
      const _network = networkName[network]
      const run = async protocol => {
        const result = await fetch(
          `https://metadata.ens.domains/${_network}/avatar/${name}/meta`
        )
        const data = await result.json()
        if ('image' in data && protocol === 'ipfs://') {
          data.image = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
        }
        setAvatar(data)
      }
      const _protocol = supportedAvatarProtocols.find(proto =>
        uri.startsWith(proto)
      )
      // check if given uri is supported
      // provided network name is valid,
      // domain name is available
      // text record key is 'avatar'
      if (_protocol && _network && name && textKey === 'avatar') {
        run(_protocol)
      }
    } catch (e) {
      console.error('useAvatar error: ', e)
    }
  }, [textKey])

  return avatar
}

export function useReferrer() {
  let location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  return queryParams.get('utm_source')
}

export function useBlock() {
  const [loading, setLoading] = useState(true)
  const [block, setBlock] = useState(undefined)

  useEffect(() => {
    getBlock()
      .then(res => {
        setBlock(res)
        setLoading(false)
      })
      .catch(() => '') // ignore error
  }, [])

  return {
    loading,
    block
  }
}

export function useOnClickOutside(refs = [], handler) {
  useEffect(() => {
    const listener = event => {
      // Do nothing if any of given refs or descendants are clicked
      for (let i = 0; i < refs.length; i++) {
        if (!refs[i].current || refs[i].current.contains(event.target)) {
          return
        }
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler])
}

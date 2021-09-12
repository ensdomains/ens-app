import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import useReactiveVarListeners from '../../../hooks/useReactiveVarListeners'

const canWrappedNameBeTransferred = () => {}

const GET_NAME_WRAPPER_OWNER = gql`
  query getNameWrapperOwner($name: string) {
    getNameWrapperOwner(name: $name) {
      ownerAddr
      canTransfer
    }
  }
`

export const USE_NAME_OWNER_DATA = gql`
  query useNameOwner @client {
    network
    accounts
  }
`

const useNameOwner = (domain, address) => {
  const { data, loading, refetch } = useQuery(GET_NAME_WRAPPER_OWNER, {
    variables: {
      name: domain.name
    },
    fetchPolicy: 'network-only'
  })

  const {
    data: { network, accounts }
  } = useQuery(USE_NAME_OWNER_DATA)

  const [isWrappedName, setIsWrappedName] = useState(false)
  const [canTransfer, setCanTransfer] = useState(false)
  const [domainOwner, setDomainOwner] = useState(null)

  useEffect(() => {
    refetch()
  }, [network, accounts])

  useEffect(() => {
    const reset = () => {
      setIsWrappedName(false)
      setCanTransfer(false)
      setDomainOwner(null)
    }

    if (domain.available || domain.owner === '0x0' || !data) {
      reset()
      return
    }

    if (domain.owner) {
      const ownerAddr =
        domain.available || domain.owner === '0x0' ? null : domain.owner

      if (!data?.getNameWrapperOwner.ownerAddr) {
        setIsWrappedName(false)
        setDomainOwner(ownerAddr)
        setCanTransfer(false)
        return
      }

      setIsWrappedName(true)
      setDomainOwner(data?.getNameWrapperOwner.ownerAddr || null)
      // setCanTransfer(
      //   data?.getNameWrapperOwner.canTransfer &&
      //     data?.getNameWrapperOwner.ownerAddr?.toLowerCase() ===
      //       address?.toLowerCase()
      // )
      setCanTransfer(true)
      return
    }

    reset()
  }, [domain, data, loading])

  return {
    isWrappedName,
    domainOwner,
    canTransfer
  }
}

export default useNameOwner

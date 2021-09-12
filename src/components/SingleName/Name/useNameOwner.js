import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const canWrappedNameBeTransferred = () => {}

const useNameOwner = (domain, address) => {
  const GET_NAME_WRAPPER_OWNER = gql`
    query getNameWrapperOwner($name: string) {
      getNameWrapperOwner(name: $name) {
        ownerAddr
        canTransfer
      }
    }
  `

  const { data, loading } = useQuery(GET_NAME_WRAPPER_OWNER, {
    variables: {
      name: domain.name
    }
  })

  const [isWrappedName, setIsWrappedName] = useState(false)
  const [canTransfer, setCanTransfer] = useState(false)
  const [domainOwner, setDomainOwner] = useState(null)

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

describe('canWrappedNameBeTranserred', () => {
  it.todo('should return fasle if falsy argument is passed in')
})

describe('useNameOwner', () => {
  it.todo('should reset if name wrapper data is loading')

  describe('name is NOT wrapped', () => {
    it.todo('should return a variable indicating name is not wrapped')
    it.todo(
      'should calculate if the name is transferrable based on ordinary domain info'
    )
    it.todo('should return owner based on ordinary domain info')
  })
  describe('name IS wrapped', () => {
    it.todo('should indicate the name is wrapped')
  })

  it.todo(
    'should reset variables if there is no domain or no address',
    () => {}
  )

  it.todo(
    'if the name is owned by the namewrapper contract, should get the owner from that contract'
  )
  it.todo(
    'if the domain is available or the owner is 0 addr, should return null'
  )
  it.todo('should return null if owner is still loading')
  it.todo('should return null if there is an error')
  it.todo('should return null if domain not provided')
  it.todo('should update if domain changes')
  it.todo('should return true if name is a wrapped name')
  it.todo('should return false if name is not a wrapped name')
  it.todo(
    'should return canTransfer == true if domain is transferable && user is owner'
  )
  it.todo('should return canTransfer == false if domain is not transferable')
  it.todo(
    'should not be fooled into thinking a name cannot be transferred because of the case of the letters in the addresses'
  )

  it.todo('should refetch name wrapper data if address or network changes')
})

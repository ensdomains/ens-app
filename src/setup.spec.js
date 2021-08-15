describe('getProvider', () => {
  describe('local blockchain', () => {
    let originalReactAppStage
    let originalReactAppEnsAddress
    beforeAll(() => {
      originalReactAppStage = process.env.REACT_APP_STAGE
      originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS
      process.env.REACT_APP_STAGE = 'local'
      process.env.REACT_APP_ENS_ADDRESS = '0xaddress'
    })
    afterAll(() => {
      process.env.REACT_APP_STAGE = originalReactAppStage
      process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress
    })

    it.todo('should return provider when using local blockchain')
  })

  describe('web3 cached provider', () => {
    it.todo('should call connect if there is a cached provider')
  })

  describe('no cached provider', () => {
    it.todo('should call setup')
  })
})

describe('setWeb3Provider', () => {
  it.todo('should update network id when network id changes')
  it.todo('should update accounts when accounts change')
  it.todo('should remove listeners on the provider if they already exist')
})

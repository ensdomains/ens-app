export const getNetworkId = provider =>
  provider.network?.chainId || provider.network || provider.networkVersion

export const getAccounts = async provider => {
  if (provider.selectedAddress) return [provider.selectedAddress]
  return await provider.listAccounts()
}

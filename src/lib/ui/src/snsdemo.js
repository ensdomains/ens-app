import { Contract, utils } from 'ethers'
import {
  getWeb3,
  getNetworkId,
  getProvider,
  getAccount,
  getSigner
} from './web3'

import snsContract from './sns.abi.json'

/* Utils */
const web3Instance = {
  web3: null,
  contract: null,
  defaultAccount: '0x1fbf89b4b06a15187f38463a5c31371a5ce28b3c'
}

async function initWeb3() {
  web3Instance.web3 = getWeb3()
  web3Instance.contract = new web3.eth.Contract(
    snsContract,
    '0x01625719fe33e919da1cd4860388a789068ccf49'
  )
  web3Instance.contract.setProvider(getProvider())
}

async function getWeb3Instance() {
  await initWeb3()
  return web3Instance
}

async function triggerContract(methodName, args) {
  let gas = 3000000
  const { contract, defaultAccount } = await getWeb3Instance()

  let callSend = 'call'
  Abi.entrys.forEach(val => {
    if (val.name === methodName) {
      callSend = /view/.test(val.stateMutability) ? 'call' : 'send'
    }
  })

  return await contract.methods[methodName](...args)[callSend]({
    from: getAccount(),
    gas: gas,
    value: callSend === 'send' ? callValue : 0
  })
}

export async function isOverDeadline() {
  return await triggerContract('isOverDeadline', [])
}

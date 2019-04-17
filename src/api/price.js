import 'whatwg-fetch'

export default function getEtherPrice() {
  return fetch(
    'https://api.etherscan.io/api?module=stats&action=ethprice'
  ).then(res => res.json())
}

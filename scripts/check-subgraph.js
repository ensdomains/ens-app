const ethers = require('ethers')
const gr = require('graphql-request')
const { request, gql } = gr
const url = 'http://127.0.0.1:8000/subgraphs/name/graphprotocol/ens'
const GET_LABEL_NAME = gql`
  query {
    registrations(first: 5, where: { labelName: "released" }) {
      labelName
    }
  }
`

async function main() {
  const { registrations } = await request(url, GET_LABEL_NAME)
  console.log({ registrations })
  if (registrations[0].labelName !== 'released') {
    throw 'There is some issue with graph indexing'
  }
}
main()

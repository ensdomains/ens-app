async function deployDNSSEC(web3, accounts, ens) {
  const { sha3 } = web3.utils
  function deploy(contractJSON, ...args) {
    const contract = new web3.eth.Contract(contractJSON.abi)
    return contract
      .deploy({
        data: contractJSON.bytecode,
        arguments: args
      })
      .send({
        from: accounts[0],
        gas: 6700000
      })
  }

  function namehash(name) {
    let node =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    if (name !== '') {
      let labels = name.split('.')
      for (let i = labels.length - 1; i >= 0; i--) {
        node = sha3(node + sha3(labels[i]).slice(2), {
          encoding: 'hex'
        })
      }
    }
    return node.toString()
  }

  function loadContract(modName, contractName) {
    return require(`@ensdomains/${modName}/build/contracts/${contractName}`)
  }

  const RSASHA256Algorithm = loadContract('dnssec-oracle', 'RSASHA256Algorithm')
  const RSASHA1Algorithm = loadContract('dnssec-oracle', 'RSASHA1Algorithm')
  const SHA256Digest = loadContract('dnssec-oracle', 'SHA256Digest')
  const SHA1Digest = loadContract('dnssec-oracle', 'SHA1Digest')
  const SHA1NSEC3Digest = loadContract('dnssec-oracle', 'SHA1NSEC3Digest')

  const dnsAnchors = require('@ensdomains/dnssec-oracle/lib/anchors')
  const anchors = dnsAnchors.realEntries
  const DnsRegistrar = loadContract('dnsregistrar', 'DNSRegistrar')
  const DNSSEC = loadContract('dnssec-oracle', 'DNSSECImpl')

  /* Deploy the main contracts  */
  const dnssec = await deploy(DNSSEC, dnsAnchors.encode(anchors))
  const registrar = await deploy(DnsRegistrar, dnssec._address, ens._address)
  await ens.methods
    .setSubnodeOwner(
      '0x00000000000000000000000000000000',
      sha3('xyz'),
      registrar._address
    )
    .send({ from: accounts[0] })
  var owner = await ens.methods.owner(namehash('xyz')).call()
  const rsasha256 = await deploy(RSASHA256Algorithm)
  const rsasha1 = await deploy(RSASHA1Algorithm)
  const sha256digest = await deploy(SHA256Digest)
  const sha1digest = await deploy(SHA1Digest)
  const sha1nsec3digest = await deploy(SHA1NSEC3Digest)
  console.log('DNSSSC ORACLE contract is deployed at ', dnssec._address)
  console.log('DNSregistrar contract is deployed at ', registrar._address)

  await dnssec.methods
    .setAlgorithm(5, rsasha1._address)
    .send({ from: accounts[0] })
  await dnssec.methods
    .setAlgorithm(7, rsasha1._address)
    .send({ from: accounts[0] })
  await dnssec.methods
    .setAlgorithm(8, rsasha256._address)
    .send({ from: accounts[0] })
  await dnssec.methods
    .setDigest(1, sha1digest._address)
    .send({ from: accounts[0] })
  await dnssec.methods
    .setDigest(2, sha256digest._address)
    .send({ from: accounts[0] })
  await dnssec.methods
    .setNSEC3Digest(1, sha1nsec3digest._address)
    .send({ from: accounts[0] })
  return { dnssec }
}
export default deployDNSSEC

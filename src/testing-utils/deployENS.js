module.exports = async function deployENS({ web3, accounts }) {
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
        gas: 4700000
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

  function loadContract(modName, contractName){
    return require(`@ensdomains/${modName}/build/contracts/${contractName}`)
  }
  
  const registryJSON = loadContract('ens', 'ENSRegistry')
  const resolverJSON = loadContract('resolver', 'PublicResolver')
  const oldResolverJSON = loadContract('ens-022', 'PublicResolver')
  const reverseRegistrarJSON = loadContract('ens', 'ReverseRegistrar')
  // const HashRegistrarSimplifiedJSON = loadContract('ens', 'HashRegistrar')

  /* Deploy the main contracts  */
  const ens = await deploy(registryJSON)
  const resolver = await deploy(resolverJSON, ens._address)
  const oldResolver = await deploy(oldResolverJSON, ens._address)
  const reverseRegistrar = await deploy(
    reverseRegistrarJSON,
    ens._address,
    resolver._address
  )
  // Disabled for now as the deploy was throwing error and this is not in use.
  // const ethRegistrar = await deploy(
  //   HashRegistrarSimplifiedJSON,
  //   ens._address,
  //   accounts[0],
  //   0
  // )

  const ensContract = ens.methods
  const resolverContract = resolver.methods
  const oldResolverContract = oldResolver.methods
  const reverseRegistrarContract = reverseRegistrar.methods
  // const ethRegistrarContract = ethRegistrar.methods

  console.log('ENS registry deployed at: ', ens._address)
  console.log('Public resolver deployed at: ', resolver._address)
  console.log('Old Public resolver deployed at: ', oldResolver._address)
  console.log('Reverse Registrar deployed at: ', reverseRegistrar._address)
  // console.log('Auction Registrar deployed at: ', ethRegistrar._address)

  const tld = 'eth'
  const tldHash = sha3(tld)

  /* Setup the root TLD */
  await ensContract
    .setSubnodeOwner('0x00000000000000000000000000000000', tldHash, accounts[0])
    .send({
      from: accounts[0]
    })

  /* Setup the root reverse node */
  await ensContract
    .setSubnodeOwner(
      '0x00000000000000000000000000000000',
      sha3('reverse'),
      accounts[0]
    )
    .send({
      from: accounts[0]
    })


  /* Setup the reverse subdomain: addr.reverse */
  await ensContract
    .setSubnodeOwner(
      namehash('reverse'),
      sha3('addr'),
      reverseRegistrar._address
    )
    .send({
      from: accounts[0]
    })

  /* Register the subdomain resolver.eth */

  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('resolver'), accounts[0])
    .send({
      from: accounts[0]
    })

  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('oldresolver'), accounts[0])
    .send({
      from: accounts[0]
    })

  /* Register some test domains */

  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('awesome'), accounts[0])
    .send({
      from: accounts[0]
    })

  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('superawesome'), accounts[0])
    .send({
      from: accounts[0]
    })

  // Setup domain  with a resolver
  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('notsoawesome'), accounts[0])
    .send({
      from: accounts[0]
    })

  await ensContract
    .setResolver(namehash('notsoawesome.eth'), resolver._address)
    .send({
      from: accounts[0]
    })

  /* Setup domain with a resolver and addr/content */
  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('abittooawesome'), accounts[0])
    .send({
      from: accounts[0]
    })

  const aBitTooAwesome = namehash('abittooawesome.eth')

  await ensContract.setResolver(aBitTooAwesome, resolver._address).send({
    from: accounts[0]
  })
  await resolverContract.setAddr(aBitTooAwesome, resolver._address).send({
    from: accounts[0]
  })

  await reverseRegistrarContract
    .setName('abittooawesome.eth')
    .send({ from: accounts[0], gas: 1000000 })

  await resolverContract
    .setContenthash(
      aBitTooAwesome,
      '0x736f6d65436f6e74656e74000000000000000000000000000000000000000001'
    )
    .send({
      from: accounts[0]
    })

  /* Setup some domains for subdomain testing */
  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('subdomaindummy'), accounts[0])
    .send({
      from: accounts[0]
    })

  await ensContract
    .setSubnodeOwner(
      namehash('subdomaindummy.eth'),
      sha3('original'),
      accounts[0]
    )
    .send({
      from: accounts[0]
    })

  await ensContract
    .setSubnodeOwner(namehash('eth'), sha3('subdomain'), accounts[0])
    .send({
      from: accounts[0]
    })

  /* Point the resolver.eth's resolver to the public resolver */
  await ensContract
    .setResolver(namehash('resolver.eth'), resolver._address)
    .send({
      from: accounts[0]
    })
  await ensContract
    .setResolver(namehash('oldresolver.eth'), oldResolver._address)
    .send({
      from: accounts[0]
    })

  /* Resolve the resolver.eth address to the address of the public resolver */
  await resolverContract
    .setAddr(namehash('resolver.eth'), resolver._address)
    .send({
      from: accounts[0]
    })
  /* Resolve the oldresolver.eth address to the address of the public resolver */

  await resolverContract
    .setAddr(namehash('oldresolver.eth'), oldResolver._address)
    .send({
      from: accounts[0]
    })

  /* Resolve the resolver.eth content to a 32 byte content hash */

  await resolverContract
    .setContenthash(
      namehash('resolver.eth'),
      // ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB
      '0xe301017012204edd2984eeaf3ddf50bac238ec95c5713fb40b5e428b508fdbe55d3b9f155ffe'
    )
    .send({
      from: accounts[0], gas:5000000
    })

  await oldResolverContract
    .setContent(
      namehash('oldresolver.eth'),
      '0x736f6d65436f6e74656e74000000000000000000000000000000000000000000'
    )
    .send({
      from: accounts[0]
    })

    /* Setup a reverse for account[0] to eth tld  */

  await reverseRegistrarContract
    .setName('eth')
    .send({ from: accounts[2], gas: 1000000 })

  /* Set the registrar contract as the owner of .eth */
  // await ensContract
  //   .setOwner(namehash('eth'), accounts[0])
  //   .send({ from: accounts[0] })

  return {
    emptyAddress:'0x0000000000000000000000000000000000000000',
    ensAddress: ens._address,
    ownerAddress: accounts[0],
    resolverAddress: resolver._address,
    reverseRegistrarAddress: reverseRegistrar._address,
    reverseRegistrarOwnerAddress: accounts[0]
  }
}

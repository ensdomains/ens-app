#!/usr/bin/env node
//const { exec, spawn, spawnSync } = require('child_process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const whitelist = [
  'apollo-upgrade-ensdev.surge.sh',
  'app.ens.domains',
  'ensdomains.surge.sh',
  'ensdomains-v2.surge.sh',
  'jefflau.dev',
  'jefflau.surge.sh',
  'impulseroutesetting.com',
  'noxious-loss.surge.sh',
  'manager.ens.domains',
  'manager-beta.ens.domains',
  'ensappdev3.surge.sh',
  'silent-geese.surge.sh',
  'hackathons.ens.domains',
  'ens-hackathons-dev.surge.sh',
  'ethparis.ens.domains',
  'learn-more-ens.surge.sh',
  'jefflau.net',
  'ensropsten.surge.sh',
  'ensdomains2.surge.sh',
  'enstestregistrar.surge.sh',
  'frontendmentor.surge.sh',
  'animedrop.surge.sh',
  'ensmanager.surge.sh',
  'animedrop.com',
  'djweddingphuket.com'
]

const removeSurgeDomain = domain => {
  const domainToRemove = domain
  console.log('domain to remove: ', domainToRemove)
  if (domainToRemove.includes('app')) {
    console.warn(`Not removing domain ${domainToRemove} as it contains 'app'`)
    return
  }
  if (domainToRemove.includes('ensdomains')) {
    console.warn(
      `Not removing domain ${domainToRemove} as it contains 'ensdomains'`
    )
    return
  }
  if (whitelist.includes(domainToRemove)) {
    console.warn(
      `Not removing domain ${domainToRemove} as it is on the whitelist`
    )
    return
  }
  console.log(`Removing domain: ${domainToRemove}`)
  exec(`surge teardown ${domainToRemove}`)
}

const run = async () => {
  const surgeList = await exec("surge list | awk '{print $4}'")
  const surgeDomains = surgeList.stdout.split(/\r?\n/)
  const filterEmpty = surgeDomains.filter(x => x)
  const cleanDomains = filterEmpty.map(x => x.replace('\x1B[39m', ''))
  const subDomains = cleanDomains.map(x => x.split('.')[0])

  const fetch = await exec('git fetch')
  const branches = await exec('git branch -a')
  const branchesList = branches.stdout.split(/\r?\n/).map(x => x.split('/')[2])
  const filterEmptyBranches = branchesList.filter(x => x)
  const trimStartBranches = filterEmptyBranches

  let domainsToRemove = []
  for (domain of cleanDomains) {
    const result = trimStartBranches.filter(branch => {
      return domain.includes(branch)
    })
    if (!result.length) {
      domainsToRemove = [...domainsToRemove, domain]
    }
  }

  if (!domainsToRemove.length) {
    console.log('Not removing any domains')
    return
  }

  console.log('domains to remove: ', domainsToRemove)

  for (domain of domainsToRemove) {
    removeSurgeDomain(domain)
  }
}
run()

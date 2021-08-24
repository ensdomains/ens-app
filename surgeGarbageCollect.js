#!/usr/bin/env node
//const { exec, spawn, spawnSync } = require('child_process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const whitelist = []

const removeSurgeDomain = domain => {
  if (domain.includes('app')) {
    console.warn(`Not removing domain ${domain} as it contains 'app'`)
    return
  }
  console.log(`Removing domain: ${domain}`)
  exec(`surge teardown ${domain}.surge.sh`)
}

const run = async () => {
  const surgeList = await exec("surge list | awk '{print $4}'")
  const surgeDomains = surgeList.stdout.split(/\r?\n/)
  const filterEmpty = surgeDomains.filter(x => x)
  const cleanDomains = filterEmpty.map(x => x.replace('\x1B[39m', ''))
  const subDomains = cleanDomains.map(x => x.split('.')[0])

  const branches = await exec('git branch')
  const branchesList = branches.stdout.split(/\r?\n/)
  const filterEmptyBranches = branchesList.filter(x => x)
  const trimStartBranches = filterEmptyBranches.map(x => x.slice(2))

  let domainsToRemove = []
  for (domain of subDomains) {
    const result = trimStartBranches.filter(branch => {
      return domain.includes(branch)
    })
    if (!result.length) {
      domainsToRemove = [...domainsToRemove, domain]
    }
  }

  for (domain of domainsToRemove) {
    removeSurgeDomain(domain)
  }
}
run()

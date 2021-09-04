const { execSync, spawn, spawnSync } = require('child_process')
const fs = require('fs')
const replace = require('replace-in-file')
const { v4 } = require('uuid')

process.env.LC_CTYPE = 'C'
process.env.LANG = 'C'

const start = async () => {
  const buildId = process.env.TRAVIS_BUILD_NUMBER || v4().substring(0, 5)
  const files = fs.readdirSync('./build/static/js/')
  const hashes = files.map(x => x.split('.')[1])
  const uniqueHashes = [...new Set(hashes)]

  for (hash of uniqueHashes) {
    execSync(
      `find ./build -type f -exec sed -i 's/${hash}/${hash}-${buildId}/g' {} \\;`
    )
  }

  for (file of files) {
    const explode = file.split('.')
    explode[1] = `${explode[1]}-${buildId}`
    const newName = explode.join('.')
    const test = 1
    fs.rename(
      `./build/static/js/${file}`,
      `./build/static/js/${newName}`,
      err => {
        console.error(err)
      }
    )
  }
}

start()

const { execSync, spawn, spawnSync } = require('child_process')
const fs = require('fs')
const replace = require('replace-in-file')
const { v4 } = require('uuid')

/*
This script will take all the hashes from the filenames found in the
build/static/js folder, and replace all references to them in the built
code with [hash]-[buildId]. It will then rename the javascript files
themselves in the same way.
 */

process.env.LC_CTYPE = 'C'
process.env.LANG = 'C'

const start = async () => {
  //fallback to random string
  const buildId = process.env.TRAVIS_BUILD_NUMBER || v4().substring(0, 5)

  //get all the file hashes from the filenames
  const files = fs.readdirSync('./build/static/js/')
  const hashes = files.map(x => x.split('.')[1])
  const uniqueHashes = [...new Set(hashes)]

  //rename references to those hashes in built code
  for (hash of uniqueHashes) {
    execSync(
      `find ./build -type f -exec sed -i 's/${hash}/${hash}-${buildId}/g' {} \\;`
    )
  }

  //rename the files themselves to match
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

#!/usr/bin/env node
const fs = require('fs')
let dockerCompose = fs.readFileSync(
  '../graph-node/docker/docker-compose.yml',
  'utf8'
)

if (!dockerCompose.includes('GRAPH_ALLOW_NON_DETERMINISTIC_IPFS')) {
  dockerCompose = dockerCompose.replace(
    /(?<=GRAPH_LOG:.*)\n/,
    "\n      GRAPH_ALLOW_NON_DETERMINISTIC_IPFS: 'true'\n"
  )
}

fs.writeFileSync('../graph-node/docker/docker-compose.yml', dockerCompose)

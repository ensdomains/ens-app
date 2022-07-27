const rewire = require('rewire')
const path = require('path')
const [type] = process.argv.slice(2)

let defaults, configFactory, config

if (type === 'start') {
  defaults = rewire('react-scripts/scripts/start.js')
  configFactory = defaults.__get__('configFactory')
  config = configFactory('development')
} else if (type === 'build') {
  defaults = rewire('react-scripts/scripts/build.js')
  configFactory = defaults.__get__('configFactory')
  config = configFactory('production')
}

const webpack = defaults.__get__('webpack')

config.optimization.usedExports = true
config.optimization.removeAvailableModules = true
config.optimization.providedExports = true
config.optimization.mergeDuplicateChunks = true
config.optimization.innerGraph = true
config.optimization.flagIncludedChunks = true

config.module.rules.push({
  test: /ens.+\.json$/,
  use: {
    loader: path.resolve(__dirname, './abi-loader.js'),
    options: {}
  }
})

config.module.rules.push({
  test: /\.m?js/,
  resolve: {
    fullySpecified: false
  }
})

config.bail = false

config.resolve.alias['@ethersproject/hash'] = path.resolve(
  __dirname,
  '../src/hash/index.js'
)

config.resolve.fallback = {
  http: false,
  https: false,
  os: false
}

config.module.strictExportPresence = false

config.plugins.push(
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser'
  })
)

config.ignoreWarnings = [/Failed to parse source map/]

if (type === 'start') {
  defaults.__set__('configFactory', () => config)
} else if (type === 'build') {
  defaults.__set__('config', config)
}

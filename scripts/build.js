const rewire = require('rewire')
const path = require('path')
const defaults = rewire('react-scripts/scripts/build.js')
const config = defaults.__get__('config')
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

config.resolve.fallback = {
  http: false,
  https: false,
  os: false
}

config.stats = 'verbose'

config.module.strictExportPresence = false

config.plugins.push(
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer']
  })
)

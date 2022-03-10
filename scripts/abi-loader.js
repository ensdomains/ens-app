exports.default = function(source) {
  const itemsToDelete = [
    'metadata',
    'bytecode',
    'deployedBytecode',
    'sourceMap',
    'deployedSourceMap',
    'source',
    'sourcePath',
    'ast',
    'legacyAST'
  ]

  try {
    let abi = JSON.parse(source)
    itemsToDelete.forEach(item => delete abi[item])
    return JSON.stringify(abi)
  } catch {
    return source
  }
}

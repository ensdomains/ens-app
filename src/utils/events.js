module.exports = ['NEW_BLOCK'].reduce((m, v) => {
  m[v] = v
  return m
}, {})

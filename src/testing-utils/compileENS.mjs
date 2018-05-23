import fs from 'fs'
import solc from 'solc'

let source = fs.readFileSync('./src/api/__tests__/ens.sol').toString()
let compiled = solc.compile(source, 1)

console.log(compiled)
fs.writeFile(
  './src/api/__tests__/ensContracts.json',
  JSON.stringify(compiled),
  err => {
    if (err) throw err
    console.log('The file has been saved!')
  }
)
